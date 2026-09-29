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

---

## v1.5.0-cashow.3

Nieuwe administratieve betaalmethode **custom**, naast de bestaande cash-settlement.
Een betaling die zo aangemaakt wordt krijgt `fiat_method: "custom"` in `payment.extra`.

### `helpers.py`

| # | Wijziging | Reden |
|---|---|---|
| 1 | `INTERNAL_FIAT_METHODS = ("cash", "custom")` toegevoegd | één plek waar de administratieve methodes staan, zodat er later makkelijk een bijkomt |
| 2 | `INTERNAL_FIAT_LABEL_COLORS` toegevoegd | eigen kleur voor het label dat LNbits op deze betalingen zet |

### `views_api.py`

| # | Wijziging | Reden |
|---|---|---|
| 1 | Invoice-aanmaak werkt op `INTERNAL_FIAT_METHODS` in plaats van op de string `"cash"` | custom volgt dezelfde interne-invoice flow |
| 2 | `checking_id` wordt `internal_<methode>_<hash>` | onderscheid tussen cash en custom |
| 3 | `_payment_method_from_payment` geeft de methode zelf terug | zodat `payment_request` op `custom` komt |
| 4 | Validatie verhuisd naar `_validate_internal_fiat_invoice` | gedeelde logica voor beide routes |
| 5 | Nieuwe route `POST /api/v1/tposs/{id}/invoices/{hash}/custom/validate` | `/cash/validate` blijft ongewijzigd bestaan |

### `tasks.py`

| # | Wijziging | Reden |
|---|---|---|
| 1 | `_payment_method` herkent custom | correcte methode op de bon en bij de doorstroming naar Orders |

### `templates/tpos/dialogs.html`

| # | Wijziging | Reden |
|---|---|---|
| 1 | Knop **CUSTOM** toegevoegd onder de cash-knop | administratieve boeking zonder echte fiat-provider |
| 2 | Validatie-modal toont `CUSTOM EUR` of `CASH EUR` | duidelijk voor de kassier wat hij bevestigt |

### `static/js/tpos.js`

| # | Wijziging | Reden |
|---|---|---|
| 1 | `internalFiatMethod` en `internalFiatMethodLabel` als computed | bepaalt de titel van de modal en de route bij validatie |
| 2 | `case 'custom'` in `selectPaymentMethod` | zet `fiatMethod` op custom en behandelt het verder als fiat |
| 3 | `validateCashInvoice` roept `/cash/validate` of `/custom/validate` aan | één knop voor beide methodes |

**Zichtbaarheid**: de CUSTOM-knop volgt dezelfde regel als de cash-knop,
`allowCashSettlement && currency != 'sats'`. De backend eist net als bij cash
een super-user-account op de wallet.

---

## v1.5.0-cashow.4

Alleen visueel, geen functionele wijziging.

### `templates/tpos/dialogs.html` - Payment Method dialog

| # | Wijziging | Reden |
|---|---|---|
| 1 | `q-mb-md` op alle vijf de knoppen | meer ruimte ertussen, minder kans op een misklik op de verkeerde betaalmethode |
| 2 | Attribuut `margin="md"` verwijderd | bestaat niet als q-btn-property, deed niets |
| 3 | Custom-knop: plus-icoon en tekstlabel CUSTOM weg, `qr_code`-icoon in de plaats | zelfde opbouw als de andere fiat-knoppen, valutasymbool plus icoon |

---

## v1.5.0-cashow.5

Alleen labels, geen functionele wijziging.

### `templates/tpos/dialogs.html` - Payment Method dialog

| # | Knop | Wijziging |
|---|---|---|
| 1 | `cash` | label **CASH** naast het `toll`-icoon |
| 2 | `custom` | label **QR STICKER** naast het `qr_code`-icoon |
| 3 | `fiat_tap` | icoon `phone_android` erbij en label **BANK**, `credit_card` blijft |

Reden: aan de kassa moet in één oogopslag duidelijk zijn welke knop welke
betaalwijze is, iconen alleen waren te dubbelzinnig.

---

## v1.5.0-cashow.6

Alleen CSS, geen functionele wijziging.

### `templates/tpos/tpos.html`

| # | Wijziging | Reden |
|---|---|---|
| 1 | `.quickfixjohn` van `calc(100% / 10)` naar `calc(100% / 7)` | zeven items per rij in plaats van tien, dus grotere tegels om aan te tikken |
| 2 | Nieuwe regel `.quickfixjohn .q-badge { font-size: 3em }` | het aantal in de tegel was te klein om vanop afstand te lezen |

---

## v1.5.0-cashow.7

### `views_api.py` - validatie van cash en custom

| # | Wijziging | Reden |
|---|---|---|
| 1 | `payment.status = PaymentState.SUCCESS` plus `update_payment` vóór `internal_invoice_queue_put` | de validatie schreef niets naar de database en vertrouwde volledig op een queue in het geheugen. Raakte dat item niet verwerkt, dan bleef de betaling pending terwijl de kassier een geslaagde validatie zag. Overgenomen van upstream `e233038` |

### `templates/tpos/tpos.html`

| # | Wijziging | Reden |
|---|---|---|
| 1 | Sats-regel onder het bedrag verwijderd | de club rekent in euro, sats zijn ruis aan de kassa |
| 2 | Sats-regel onder `Total` verwijderd | zelfde reden |

### `static/js/tpos.js`

| # | Wijziging | Reden |
|---|---|---|
| 1 | De print-dialoog opent niet meer automatisch na een betaling | die onderbrak de kassier bij elke transactie. Printen kan nog via de bonnenhistoriek, waar `printReceipt` en `printOrderReceipt` rechtstreeks aangeroepen worden |

**Nog open, bewust niet in deze release**: de ATM-refund die stil faalt in
`views_atm.py`. Zit ook nog in upstream, wordt apart aangepakt.

---

## v1.5.0-cashow.8

Mislukte ATM-uitbetaling die als geslaagd gemeld werd. Aanleiding: een refund
van 93.500 sats op 26 september die niet uitbetaald werd terwijl de kassier
"Withdraw processed successfully" te zien kreeg.

Beide bugs zitten ook nog in `upstream/main` van lnbits/tpos, dus dit is geen
fout die in deze fork geïntroduceerd is.

### `views_atm.py`

| # | Wijziging | Reden |
|---|---|---|
| 1 | `api_tpos_atm_pay` controleert nu eerst de charge: bestaat, nog niet geclaimd, en `amount` komt overeen met de URL | het bedrag wordt alleen gezet door `GET /atm/withdraw/{charge}/{amount}`. Zonder die controle werd er een invoice aangemaakt bij de klant die `lnurl_callback` daarna weigerde, met de melding `has no amount specified` |
| 2 | Het bedrag uit de URL wordt bewust **niet** overgenomen | een tik met een oud bedrag zou dan alsnog uitbetalen. Op 12 september was dat 100 sats geweest |
| 3 | De fout van `execute_withdraw` wordt niet meer opgeslokt | voorheen werd hij enkel gelogd en kreeg de kassier toch succes te zien |
| 4 | `except HTTPException: raise` vóór de algemene `except` | anders wordt elke controle hierboven alsnog een generieke 500 zonder bruikbare boodschap |

### `static/js/tpos.js`

| # | Wijziging | Reden |
|---|---|---|
| 1 | De `AbortController` van `readNfcTag` wordt bewaard en afgebroken via `stopNfcReader`, bij het sluiten van de dialoog en bij het verlaten van de ATM-modus | hij was een lokale variabele die alleen bij een lezing werd afgebroken. Een afgebroken cyclus liet de lezer scherp staan, waarna een latere tik afvuurde op de charge van een volgende cyclus. Dat is de directe oorzaak van 26 september |
| 2 | `nfcTagReading` wordt mee gereset | bleef op true staan en blokkeerde elke volgende `readNfcTag` |
| 3 | `atmConfirmedSat` onthoudt het door de server bevestigde bedrag, `makeWithdraw` weigert een tik die er niet mee overeenkomt | tweede slot, ook tegen een tik met een gewijzigd bedrag |
| 4 | Na een geweigerde tik start de lezer opnieuw | anders moet de kassier de pagina herladen om opnieuw te kunnen tikken |
| 5 | `closeInvoiceDialog` ruimt niets op als er alweer een dialoog open staat | `@hide` van Quasar vuurt vertraagd, een sluitende oude dialoog mag de lezer van de nieuwe cyclus niet afbreken |

**Restrisico**: de invoice bij de klant wordt nog steeds aangemaakt vóór
`execute_withdraw` draait. Faalt die stap alsnog, bijvoorbeeld door saldo dat
zakt tussen bevestiging en tik, dan blijft er opnieuw een onbetaalde invoice
achter. Zeldzamer, maar niet nul.
