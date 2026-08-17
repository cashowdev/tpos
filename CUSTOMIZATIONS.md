# Cashow aanpassingen op TPoS

Deze fork vertrekt van upstream tag `v1.5.0` (https://github.com/lnbits/tpos/releases/tag/v1.5.0).

Volledig overzicht van de verschillen:

```bash
git diff v1.5.0..cashow
```

of https://github.com/cashowdev/tpos/compare/v1.5.0...cashow

---

## v1.5.0-cashow.1

### `templates/tpos/dialogs.html` - Payment Method dialog

| # | Wijziging | Reden |
|---|---|---|
| 1 | Alle knoppen van `col-6` naar `col-12`, plus `margin="md"` | knoppen onder elkaar, volle breedte, beter aan te tikken op de terminal |
| 2 | Lightning-knop: bitcoin-symbool vervangen door icoon `card_membership`, label "Lightning" wordt "CLUB WALLET" | terminologie voor de club, niet voor bitcoiners |
| 3 | Knop "fiat" (`selectPaymentMethod('fiat')`, icoon `qr_code`) volledig verwijderd | wordt niet gebruikt, `fiat_tap` blijft wel behouden |

Ongewijzigd gebleven: de Onchain-knop, de cash/TAP-knop en de fiat_tap-knop (behalve de breedte).

---

## Sjabloon voor volgende wijzigingen

### `pad/naar/bestand`

| # | Wijziging | Reden |
|---|---|---|
| | | |
