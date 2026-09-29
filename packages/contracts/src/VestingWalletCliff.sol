// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { VestingWallet } from "@openzeppelin/contracts/finance/VestingWallet.sol";

/**
 * @title VestingWalletCliff
 * @notice OZ VestingWallet with a cliff gate on top of the default linear
 *         schedule. Used for the EVOLVE team allocation (1.6B): the vesting
 *         curve is LINEAR from `start` across the full 36-month horizon, but
 *         nothing is vested or releasable before `cliffEnd = start + 12m`;
 *         at the cliff exactly 12/36 (33.33%) unlocks, 100% at start + 36m.
 *
 *         The wallet holds NO MINTER_ROLE on EVOLVE — the team allocation is
 *         transferred in via a 48h timelock-approved `EVOLVE.mint`.
 */
contract VestingWalletCliff is VestingWallet {
    uint64 private immutable _cliffDuration;

    /// @dev Claim attempted before the cliff elapsed. `cliffEnd` is the first
    ///      timestamp at which release() succeeds.
    error BeforeCliff(uint256 cliffEnd);

    /// @dev Misconfigured schedule: the cliff would outlast the vesting end.
    error CliffLongerThanVesting(uint64 cliffDuration, uint64 vestingDuration);

    /**
     * @param beneficiary             address that receives released assets (also
     *                                the Ownable owner of the wallet).
     * @param startTimestamp          vesting start; pass 0 to start at the
     *                                deployment block timestamp.
     * @param cliffDurationSeconds    nothing vested/releasable before
     *                                start + cliff (12m = 31_536_000).
     * @param vestingDurationSeconds  full linear horizon (36m = 94_608_000).
     */
    constructor(
        address beneficiary,
        uint64 startTimestamp,
        uint64 cliffDurationSeconds,
        uint64 vestingDurationSeconds
    )
        VestingWallet(
            beneficiary,
            startTimestamp == 0 ? uint64(block.timestamp) : startTimestamp,
            vestingDurationSeconds
        )
    {
        if (cliffDurationSeconds > vestingDurationSeconds) {
            revert CliffLongerThanVesting(cliffDurationSeconds, vestingDurationSeconds);
        }
        _cliffDuration = cliffDurationSeconds;
    }

    /// @dev Length of the cliff period, in seconds.
    function cliffDuration() public view returns (uint64) {
        return _cliffDuration;
    }

    /// @dev First timestamp at which vested amounts become non-zero and
    ///      release() stops reverting.
    function cliffEnd() public view returns (uint256) {
        return start() + _cliffDuration;
    }

    /**
     * @dev ETH vesting with the cliff gate: 0 before cliffEnd, otherwise the
     *      OZ linear curve from start across the full duration.
     */
    function vestedAmount(uint64 timestamp) public view virtual override returns (uint256) {
        if (timestamp < cliffEnd()) {
            return 0;
        }
        return super.vestedAmount(timestamp);
    }

    /// @dev ERC20 vesting with the same cliff gate.
    function vestedAmount(
        address token,
        uint64 timestamp
    ) public view virtual override returns (uint256) {
        if (timestamp < cliffEnd()) {
            return 0;
        }
        return super.vestedAmount(token, timestamp);
    }

    /// @dev ETH release reverts BeforeCliff when called before the cliff.
    function release() public virtual override {
        if (block.timestamp < cliffEnd()) {
            revert BeforeCliff(cliffEnd());
        }
        super.release();
    }

    /// @dev ERC20 release reverts BeforeCliff when called before the cliff.
    function release(address token) public virtual override {
        if (block.timestamp < cliffEnd()) {
            revert BeforeCliff(cliffEnd());
        }
        super.release(token);
    }
}
