// PrivateGift — private transfer via note commitment + nullifier (prototype).
//
// Models the ZK primitive Aztec private state builds on:
//   - a NOTE is (value, owner, blinding secret);
//   - its COMMITMENT (public, sits in the note-hash tree) is a pedersen hash of the note;
//   - spending reveals a NULLIFIER (pedersen of commitment+secret) so a note can only be
//     spent once, without revealing WHICH note was spent (privacy + no double-spend).
//
// This is pure Noir (no aztec-nr) so it compiles/tests with `aztec-nargo test` headlessly.
// (Production Aztec uses poseidon2; the commitment/nullifier structure is identical —
//  pedersen is used here for the stable std API.)

use std::hash::pedersen_hash;

struct Note {
    value: Field,
    owner: Field,
    secret: Field,
}

/// Public commitment of a note (stored in the note-hash tree).
fn note_commitment(note: Note) -> Field {
    pedersen_hash([note.value, note.owner, note.secret])
}

/// Nullifier revealed when the note is spent. Same note → same nullifier (double-spend proof).
fn note_nullifier(commitment: Field, secret: Field) -> Field {
    pedersen_hash([commitment, secret])
}

/// Private transfer: spend `amount` out of `sender_note`, producing a fresh note for
/// `recipient`. Returns (recipient_commitment, sender_nullifier).
fn transfer(sender_note: Note, amount: Field, recipient: Field, recipient_secret: Field) -> (Field, Field) {
    assert(sender_note.value != 0);
    assert(amount as u64 <= sender_note.value as u64);
    assert(amount as u64 > 0);

    let spent_commitment = note_commitment(sender_note);
    let nullifier = note_nullifier(spent_commitment, sender_note.secret);

    let recipient_note = Note { value: amount, owner: recipient, secret: recipient_secret };
    let recipient_commitment = note_commitment(recipient_note);

    (recipient_commitment, nullifier)
}

fn main() {}

#[test]
fn commitment_is_deterministic() {
    let note = Note { value: 100, owner: 0x1234, secret: 42 };
    assert_eq(note_commitment(note), note_commitment(note));
}

#[test]
fn nullifier_differs_from_commitment() {
    let note = Note { value: 100, owner: 0x1234, secret: 42 };
    let c = note_commitment(note);
    let nf = note_nullifier(c, note.secret);
    assert(c != nf);
}

#[test]
fn transfer_produces_expected_recipient_commitment() {
    let sender = 0xaaa;
    let recipient = 0xbbb;
    let sender_note = Note { value: 100, owner: sender, secret: 7 };
    let (recv_commitment, _nullifier) = transfer(sender_note, 50, recipient, 99);

    let expected = note_commitment(Note { value: 50, owner: recipient, secret: 99 });
    assert_eq(recv_commitment, expected);
}

#[test]
fn transfer_output_is_unlinked_from_sender_note() {
    let sender_note = Note { value: 100, owner: 0xaaa, secret: 7 };
    let (recv_commitment, _) = transfer(sender_note, 50, 0xbbb, 99);
    // Privacy: the recipient's commitment reveals nothing about the sender's spent commitment.
    assert(recv_commitment != note_commitment(sender_note));
}

#[test]
fn double_spend_yields_identical_nullifier() {
    let sender_note = Note { value: 100, owner: 0xaaa, secret: 7 };
    let (_c1, nf1) = transfer(sender_note, 40, 0xbbb, 99);
    let (_c2, nf2) = transfer(sender_note, 40, 0xccc, 123);
    // Spending the SAME note twice yields the SAME nullifier → the on-chain nullifier set
    // (not modeled here, see docs) would reject the second spend.
    assert_eq(nf1, nf2);
}
