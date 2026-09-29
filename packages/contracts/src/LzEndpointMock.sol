// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title LzEndpointMock
 * @notice Minimal no-op stand-in for the LayerZero EndpointV2 contract, used
 *         ONLY by local ignition deploys (`deploy:local` / `deploy:localhost`
 *         when the `lzEndpoint` parameter is absent). EVOLVE (OFT) calls
 *         `endpoint.setDelegate(delegate)` inside its constructor and EDR
 *         reverts calls to addresses without code, so local deployments need
 *         a live endpoint — this no-op satisfies that call. Real networks pass
 *         the actual endpoint via the `lzEndpoint` ignition parameter and this
 *         contract is never deployed there. NOT for production use.
 */
contract LzEndpointMock {
    address public delegate;

    function setDelegate(address _delegate) external {
        delegate = _delegate;
    }
}
