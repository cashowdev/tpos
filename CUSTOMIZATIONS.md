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

---

## v1.5.0-cashow.2

### `templates/tpos/tpos.html`

| # | Wijziging | Reden |
|---|---|---|
| 1 | CSS-klasse `.quickfixjohn` toegevoegd (10 items per rij) | vaste kaartbreedte vervangen door een breedte in tienden |

### `templates/tpos/_cart.html`

| # | Wijziging | Reden |
|---|---|---|
| 1 | Sats-subtotaal onder het totaal in de winkelwagen verwijderd | club werkt in euro, sats zijn ruis aan de kassa |
| 2 | Vaste kaart van 150x150 vervangen door `.quickfixjohn` | meer items per rij, schaalt mee met het scherm |
| 3 | Knop "Hold Cart" verwijderd | niet gebruikt |
| 4 | Checkout-knop herwerkt: groen, breder (180px) | duidelijker aan de kassa |
| 5 | Dubbele `label` en `padding` op die knop opgeruimd | bij dubbele attributen wint de eerste, de tweede was dode code |

### `templates/tpos/dialogs.html`

| # | Wijziging | Reden |
|---|---|---|
| 1 | Sats-bedrag verwijderd uit de lijst met laatste betalingen | zelfde reden als hierboven |
| 2 | Overgebleven `</q-item-label>` weggehaald | tags waren niet in balans, 11 open tegenover 12 gesloten |
