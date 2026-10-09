// PrivateBond — private conception-bond settlement skeleton (prototype, todo 11).
//
// Models the Mode-3 "cryptic choice" settlement as private notes:
//   - a man STAKEs via a note (value = stake, owner = man, secret);
//   - the woman's CHOICE is private (only the chosen father is revealed at settlement);
//   - SETTLEMENT nullifies the stake note once and splits it 90% → woman, 10% → father.
//
// Gaps (documented in docs/AZTEC-PROTOTYPE.md):
//   - timing logic (48h session window, 14-day settle delay) lives in a PUBLIC contract and
//     is NOT reproducible in pure-Noir private context without a clock oracle;
//   - nullifier MANAGEMENT (the on-chain nullifier-set membership check that actually
//     prevents double-spend) is Aztec's, not modeled here — only nullifier DERIVATION is.
//
// Pure Noir, compiled/tested with `aztec-nargo test`.

use std::hash::pedersen_hash;

struct Note {
    value: Field,
    owner: Field,
    secret: Field,
}

fn note_commitment(note: Note) -> Field {
    pedersen_hash([note.value, note.owner, note.secret])
}

fn note_nullifier(commitment: Field, secret: Field) -> Field {
    pedersen_hash([commitment, secret])
}

/// Settle a stake note: nullify it and split 90% → woman, 10% → chosen father.
/// Returns (stake_nullifier, woman_commitment, father_commitment).
fn settle_stake(
    stake_note: Note,
    woman: Field,
    father: Field,
    woman_secret: Field,
    father_secret: Field,
) -> (Field, Field, Field) {
    assert(stake_note.value != 0);

    let spent = note_commitment(stake_note);
    let nullifier = note_nullifier(spent, stake_note.secret);

    let to_woman = (stake_note.value * 90) / 100;
    let to_father = (stake_note.value * 10) / 100;

    let woman_commitment = note_commitment(Note { value: to_woman, owner: woman, secret: woman_secret });
    let father_commitment = note_commitment(Note { value: to_father, owner: father, secret: father_secret });

    (nullifier, woman_commitment, father_commitment)
}

fn main() {}

#[test]
fn settlement_splits_90_10() {
    let stake = Note { value: 1000, owner: 0x1111, secret: 5 };
    let (_, w, f) = settle_stake(stake, 0x2222, 0x3333, 11, 12);

    let expected_woman = note_commitment(Note { value: 900, owner: 0x2222, secret: 11 });
    let expected_father = note_commitment(Note { value: 100, owner: 0x3333, secret: 12 });
    assert_eq(w, expected_woman);
    assert_eq(f, expected_father);
}

#[test]
fn settlement_nullifies_the_stake() {
    let stake = Note { value: 1000, owner: 0x1111, secret: 5 };
    let (nf, _, _) = settle_stake(stake, 0x2222, 0x3333, 11, 12);
    let expected = note_nullifier(note_commitment(stake), stake.secret);
    assert_eq(nf, expected);
}

#[test]
fn woman_and_father_commitments_are_distinct_and_unlinked() {
    let stake = Note { value: 1000, owner: 0x1111, secret: 5 };
    let (nf, w, f) = settle_stake(stake, 0x2222, 0x3333, 11, 12);
    assert(w != f);
    assert(w != note_commitment(stake));
    assert(f != note_commitment(stake));
    assert(nf != w);
    assert(nf != f);
}
