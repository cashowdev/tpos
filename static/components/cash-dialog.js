// cashow: rekenhulp voor wisselgeld bij een cash-afrekening.
//
// Puur een hulpmiddel op het scherm. Het bedrag dat naar LNbits gaat blijft
// het factuurbedrag, en "ontvangen" en "wisselgeld" worden nergens bewaard.
//
// Staat bewust in een eigen bestand in plaats van in dialogs.html, zodat een
// rebase op upstream hier niet op botst.
//
// De terminal staat op een toestel met beperkte schermhoogte, dus de modal
// blijft zo kort mogelijk: geen titel, kleine marges, en ontvangen en
// wisselgeld naast elkaar op één rij.
//
// Let op: in een component-template gelden de standaard Vue-delimiters, niet
// de ${ } van de pagina-templates. Daarom overal v-text en :label.
window.app.component('tpos-cash-dialog', {
  name: 'tpos-cash-dialog',
  props: [
    'methodLabel',
    'currency',
    'toPay',
    'activePaymentAmountWithTipFormatted',
    'validating',
    'format'
  ],
  emits: ['validate'],
  data() {
    return {
      // coupures in centen, zodat er nergens met kommagetallen gerekend wordt
      notes: [
        {cents: 500, label: '5', color: '#78909c'},
        {cents: 1000, label: '10', color: '#c62828'},
        {cents: 2000, label: '20', color: '#1565c0'},
        {cents: 5000, label: '50', color: '#ef6c00'}
      ],
      coins: [
        {cents: 50, label: '0,50'},
        {cents: 100, label: '1'},
        {cents: 200, label: '2'}
      ],
      counts: {}
    }
  },
  computed: {
    toPayCaption() {
      return `${this.methodLabel} TO PAY`
    },
    // cashow: formatAmount deelt door de schaal van de serverdenominatie
    // zodra die geen sats is. In dat geval staan bedragen in minor units en
    // niet in euro. Daarom rekent dit component intern in eurocenten en
    // vertaalt het alleen op de rand, zodat de coupures kloppen ongeacht de
    // instelling van de instance.
    unitsPerEuro() {
      if (typeof g === 'undefined' || !g.settings) return 1
      if (g.settings.denomination === 'sats') return 1
      return getTposCurrencyScale(g.settings.denomination)
    },
    toPayCents() {
      const euro = (Number(this.toPay) || 0) / this.unitsPerEuro
      return Math.round(euro * 100)
    },
    receivedCents() {
      return Object.keys(this.counts).reduce(
        (total, cents) => total + Number(cents) * this.counts[cents],
        0
      )
    },
    receivedFormatted() {
      return this.formatCents(this.receivedCents)
    },
    hasInput() {
      return this.receivedCents > 0
    },
    differenceCents() {
      return this.receivedCents - this.toPayCents
    },
    isShort() {
      return this.hasInput && this.differenceCents < 0
    },
    differenceLabel() {
      return this.isShort ? 'STILL TO RECEIVE' : 'CHANGE'
    },
    differenceFormatted() {
      // zonder ingetikte coupures is het wisselgeld nog niets, anders zou hier
      // het volle bedrag staan alsof de kassier dat moet teruggeven
      if (!this.hasInput) return this.formatCents(0)
      return this.formatCents(Math.abs(this.differenceCents))
    },
    differenceClass() {
      if (!this.hasInput) return 'text-grey-6'
      return this.isShort ? 'text-warning' : 'text-positive'
    }
  },
  methods: {
    formatCents(cents) {
      return this.format((cents / 100) * this.unitsPerEuro, this.currency)
    },
    countFor(cents) {
      return this.counts[cents] || 0
    },
    add(cents) {
      this.counts[cents] = this.countFor(cents) + 1
    },
    remove(cents) {
      const current = this.countFor(cents)
      if (current <= 0) return
      this.counts[cents] = current - 1
    },
    reset() {
      this.counts = {}
    }
  },
  template: `
    <div class="text-center q-mb-sm full-width">
      <div class="text-caption text-grey-6" v-text="toPayCaption"></div>
      <h3
        class="q-mt-none q-mb-sm"
        v-text="activePaymentAmountWithTipFormatted"
      ></h3>

      <div class="row items-center q-mb-xs">
        <div class="text-caption text-grey-6">NOTES</div>
        <q-space></q-space>
        <q-btn
          outline
          round
          dense
          size="sm"
          color="grey-5"
          icon="restart_alt"
          aria-label="Reset"
          @click="reset"
        ></q-btn>
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-3" v-for="note in notes" :key="note.cents">
          <q-btn
            unelevated
            no-caps
            class="full-width text-h6 text-weight-bold q-py-xs"
            text-color="white"
            :style="{backgroundColor: note.color}"
            :label="'€ ' + note.label"
            @click="add(note.cents)"
          >
            <q-badge
              v-if="countFor(note.cents)"
              floating
              color="white"
              text-color="black"
              :label="countFor(note.cents)"
            ></q-badge>
          </q-btn>
          <q-btn
            outline
            dense
            size="sm"
            color="grey-6"
            icon="remove"
            class="full-width q-mt-xs"
            :disable="!countFor(note.cents)"
            :aria-label="'Remove ' + note.label + ' euro'"
            @click="remove(note.cents)"
          ></q-btn>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-xs justify-center">
        <div class="col-3" v-for="coin in coins" :key="coin.cents">
          <q-btn
            outline
            rounded
            dense
            no-caps
            class="full-width"
            color="grey-5"
            :label="'€ ' + coin.label"
            @click="add(coin.cents)"
          >
            <q-badge
              v-if="countFor(coin.cents)"
              floating
              color="white"
              text-color="black"
              :label="countFor(coin.cents)"
            ></q-badge>
          </q-btn>
          <q-btn
            outline
            dense
            size="sm"
            color="grey-7"
            icon="remove"
            class="full-width q-mt-xs"
            :disable="!countFor(coin.cents)"
            :aria-label="'Remove ' + coin.label + ' euro'"
            @click="remove(coin.cents)"
          ></q-btn>
        </div>
      </div>

      <q-card flat bordered class="q-mt-sm q-pa-sm">
        <div class="row items-stretch no-wrap text-left">
          <div class="col row items-center">
            <div class="text-caption text-grey-6 q-mr-sm">RECEIVED</div>
            <div class="text-h6" v-text="receivedFormatted"></div>
          </div>
          <q-separator vertical class="q-mx-sm"></q-separator>
          <div class="col row items-center">
            <div
              class="text-caption text-grey-6 q-mr-sm"
              v-text="differenceLabel"
            ></div>
            <div
              class="text-h6 text-weight-bold"
              :class="differenceClass"
              v-text="differenceFormatted"
            ></div>
          </div>
        </div>
      </q-card>

      <div class="row items-center q-mt-md">
        <q-btn
          color="primary"
          :loading="validating"
          label="VALIDATE"
          @click="$emit('validate')"
        ></q-btn>
        <q-space></q-space>
        <q-btn v-close-popup flat color="grey">CLOSE</q-btn>
      </div>
    </div>
  `
})
