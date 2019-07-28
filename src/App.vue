<template lang="pug">
  main(id='app')
    .start(v-if="nowPage === 'start'")
      .start__container
        img(src="./assets/images/pic-king.svg")
        img.start__logo(src="./assets/images/logo.svg")
        span.start__button(@click="gameStart()") 開始遊戲
    .game(v-if="nowPage === 'game'")
      .game__container
        .game__header
          img(src="./assets/images/logo.svg")
          .game__control-container
            span.game__control
              img.game__icon(src="./assets/images/icon-refash.svg")
              |重玩
            span.game__control
              img.game__icon(src="./assets/images/icon-back.svg")
              |上一步
            span.game__control
              img.game__icon(src="./assets/images/icon-stop.svg")
              |暫停
        .game__playground
          .game__block
            span.card--bg
            span.card--bg
            span.card--bg
            span.card--bg
          .game__block
            span.card--complete
            span.card--complete
            span.card--complete
            span.card--complete
          .game__block(v-for="i in 2")
            draggable.card__list(
              v-for="list in 4"
              :key="list"
              group="cardlist"
              :list="cardlist[0]"
            )
              div(
                v-for="card in cardlist[list - 1 + (i - 1) * 4]"
                :key="card.Id"
                :class="['card', card.styleClass]"
                :style="{'color': card.color}"
              )
                span.card__number
                  |{{card.number}}
                  img.card__number-icon(:src="card.icon")
                span.card__number
                  |{{card.number}}
                  img.card__number-icon(:src="card.icon")
                div.card__content(v-if="card.image === null")
                  div(:class="['card__center-column', card.styleClass]")
                    img.card__image(:src="card.icon" v-for="img in card.centerColumn")
                div.card__content(v-if="card.image === null")
                  div(:class="['card__other-column', card.styleClass]")
                    span.card__image-container(v-for="img in card.otherColumn")
                      img.card__image(:src="card.icon")
                div.card__content(v-if="card.image !== null")
                  div.card__big-colum
                    img.card__big-image(:src="card.image")
        .game__info
          .game__timer
            |Time {{showTime()}}
          .game__score
            |Score: 02
    .popup(v-if="popup.states")
      .popup__container
        span.popup__image
          img(src="./assets/images/pic-rule.svg")
        .popup__title 怎麼玩
        .popup__content 新接龍(Freecell)是一款使用52張牌進行的單人卡片遊戲，遊戲目標是將整副牌搬到右上角的四個空欄中。
          br
          |將一副標準52張撲克牌洗牌，再分別置於8個欄目，其中4個欄目有7張紙牌，其餘4個欄目有6張紙牌，每張撲克牌皆要以翻開顯示。
          br
          |另外還有右上角四個本位欄框、左上角四個空白欄。
          br
          |紙牌 A、2 可立即放到本位欄框，而其他同花色的牌則可以由小到大依序疊上去。
          br
          |只要將所有的牌都放到本位欄框中，就成功了。
          br
          |空白欄框為四個放牌位置。
          br
          |每個欄框都可任意放一張紙牌。
          br
          |移動紙牌的規則如下： 將紙牌移動到某一欄時的順序必須為由大到小，而且是不同的顏色（即黑、紅兩種顏色）。
          br
          |將紙牌移至本位欄框時，必須以相同花色，將牌按照從低（A）到高（K）的順序移動。
          br
          |某欄最底端的紙牌可移到空白欄框、另一欄的最底端或 本位欄框。
          br
          |空白欄框中的紙牌可移至某一欄的最底端或本位欄框。
        .popup__button-container
          span.popup__button(@click="closePopup()") 確定
</template>

<script>
import draggable from 'vuedraggable'

import './assets/style/normalize.css'
import './assets/style/reset.css'

import cardIcon1 from './assets/images/icon-card3.svg'
import cardIcon2 from './assets/images/icon-card2.svg'
import cardIcon3 from './assets/images/icon-card1.svg'
import cardIcon4 from './assets/images/icon-card4.svg'
import cardImage11 from './assets/images/pic-card-elf.svg'
import cardImage12 from './assets/images/pic-card-knight.svg'
import cardImage13 from './assets/images/pic-card-king.svg'

export default {
  name: 'app',
  components: {
    draggable
  },
  data() {
    return {
      nowPage: 'start',
      popup: {
        type: '',
        states: false
      },
      timerDetail: {
        timer: null,
        isTimerStart: false,
        timerStatus: 'rest',
        time: 0
      },
      cardlist: []

    }
  },
  mounted() {
  },
  created() {
    for (let i = 0; i < 8; i++) {
      this.cardlist.push([])
    }
    // let maxList = []
    for (let i = 1; i < 53; i++) {
      let random_number = this.randomNumber()
      let maxCard = this.cardlist[random_number].length > 6
      // if (maxCard) { maxList.push(random_number) }
      while (maxCard) {
        random_number = this.randomNumber()
        maxCard = this.cardlist[random_number].length > 6
      }
      const number = i % 13 === 0 ? 13 : i % 13
      let cardText
      switch (number) {
        case 11:
          cardText = 'J'
          break
        case 12:
          cardText = 'Q'
          break
        case 13:
          cardText = 'K'
          break
        default:
          cardText = number
      }
      this.cardlist[random_number].push({
        Id: i,
        styleClass: `card__number${i}`,
        number: cardText,
        color: i > 26 ? '#F1697B' : '#565656',
        icon: this.cardIcon(i),
        image: this.cardImage(number),
        centerColumn: this.centerIconQuantity(number),
        otherColumn: number - this.centerIconQuantity(number)
      })
    }
    console.log(this.cardlist)
  },
  computed: {
  },
  methods: {
    randomNumber() {
      return Math.floor(Math.random() * 8)
    },
    cardIcon(number) {
      let icon
      if (number < 14) {
        icon = cardIcon1
      } else if (number > 13 && number < 27) {
        icon = cardIcon2
      } else if (number > 26 && number < 40) {
        icon = cardIcon3
      } else if (number > 39) {
        icon = cardIcon4
      }
      return icon
    },
    cardImage(number) {
      let image
      switch (number) {
        case 11:
          image = cardImage11
          break
        case 12:
          image = cardImage12
          break
        case 13:
          image = cardImage13
          break
        default:
          image = null
      }
      return image
    },
    centerIconQuantity(number) {
      if (number > 3 && number < 10) {
        console.log(number % 2)
        return number % 2
      } else {
        console.log(number % 4)
        return number % 4
      }
    },
    gameStart() {
      this.nowPage = 'game'
      this.popup.states = true
    },
    closePopup() {
      this.popup.states = false
      this.timerStart()
    },
    showTime() {
      let timeValue = ''
      if (this.timerDetail.time > -1) {
        const min = Math.floor(this.timerDetail.time / 60)
        const sec = this.timerDetail.time % 60
        if (min < 10) { timeValue += '0' }
        timeValue += min + ':'
        if (sec < 10) { timeValue += '0' }
        timeValue += sec
      }
      return timeValue
    },
    timerStart() {
      this.timerDetail.isTimerStart = true
      this.timerDetail.timerStatus = 'work'
      this.timerDetail.timer = setInterval(() => {
        this.timerDetail.time++
      }, 1000)
    }
  }
}
</script>

<style lang="stylus" scoped>
#app
  color #58554F
.start
  display flex
  justify-content center
  align-items center
  height 100vh
  text-align center
  background url(./assets/images/bg-img-wellcome.svg) #fff bottom no-repeat
  &__container
    width 265px
  &__logo
    margin 19px 0 24px
  &__button
    border 3px solid #82D5E8
    font-size 30px
    width 185px
    line-height 55px
    display inline-block
    border-radius 30px
    color #82D5E8
    cursor pointer
.game
  position: relative;
  padding-top: 62.5%;
  &__container
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background url(./assets/images/bg-img-main.svg) #fff bottom no-repeat
    display: flex;
    flex-direction: column;
  &__header
    display: flex;
    justify-content: space-between;
    padding: 30px 42px;
  &__control-container
    display: flex;
  &__control
    height: 70px;
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius 5px
    transition background .35s ease
    cursor pointer
    &:hover
      background #F7F6F5
  &__icon
    height 25px
    display flex
    margin 5px auto
  &__info
    text-align: center;
    margin: 26px 0;
    color #fff
  &__timer
    font-size 42px
    font-family: 'Noto Sans TC, Light', helvetica, arial, sans-serif;
    line-height: 62px;
    letter-spacing: 3px;
  &__score
    font-size 26px
    font-weight: bold;
    line-height: 38px;
    letter-spacing: 3px;
  &__playground
    display flex
    flex-wrap: wrap;
    justify-content: space-between;
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
  &__block
    display: flex;
    width: 45%;
    justify-content: space-around;
.card
  border: 1px solid #D9D9D9
  background: #f7f6f5;
  border-radius: 5px;
  padding-top: 137%;
  width: 100%
  position: relative;
  &:not(:first-child)
    margin-top: -100%
  &__number
    position: absolute;
    padding: 5px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    width: 26px;
    &:nth-child(1)
      top: 0;
      left: 0;
    &:nth-child(2)
      bottom :0
      right 0
      transform: rotate(180deg);
    &-icon
      width 8px
      margin 3px auto 0
      display block
  &__content
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  &__center-column
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 60%;
    align-items: center;
    width: 100%;
  &__other-column
    display: flex;
    flex-wrap wrap
    justify-content: space-around;
    align-content: space-around;
    height: 60%;
    width: 80%;
  &__big-colum
    height: 85%;
    width: 100%;
  &__big-image
    max-width 100%
    max-height 100%
  &__image-container
    width 50%
    text-align center
  &__image
    width 15px
  &__list
    width: 19%;
    margin: 3%;
  &--bg
    border: 1px solid #afafaf;
    background: #f7f6f5;
    border-radius: 5px;
    padding-top: 26%;
    width: 19%;
    margin: 3%;
  &--complete
    background-color: #f7f6f5;
    border-radius: 5px;
    padding-top: 26%;
    width: 19%;
    margin: 3%;
    box-shadow: 0 4px 14px 0px rgba(62, 62, 62, 0.29);
    background-repeat no-repeat
    background-position center
    background-size 30px
    &:nth-child(1)
      background-image url(./assets/images/icon-cardbg1.svg)
    &:nth-child(2)
      background-image url(./assets/images/icon-cardbg2.svg)
    &:nth-child(3)
      background-image url(./assets/images/icon-cardbg3.svg)
    &:nth-child(4)
      background-image url(./assets/images/icon-cardbg4.svg)
.popup
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: rgba(64, 64, 64, .4);
  z-index: 100;
  &__container
    width: 444px;
    text-align: center;
    background: #F7F6F5;
    padding: 22px 26px;
    border: 5px solid #82D5E8;
    border-radius: 10px;
    color: #58554F;
  &__image
    display: block;
    position: relative;
    margin-top: -70px;
  &__title
    font-size: 26px;
    padding: 10px;
    color: #82D5E8;
  &__content
    font-family: 'Noto Sans TC, Light', helvetica, arial, sans-serif;
    height: 360px;
    font-size: 15px;
    line-height: 26px;
    letter-spacing: 3px;
    text-align: left;
    overflow-y: auto;
    padding: 0 21px;
  &__button-container
    font-family: 'Noto Sans TC, Light', helvetica, arial, sans-serif;
    text-align center
  &__button
    line-height: 50px;
    width: 116px;
    text-align: center;
    font-size: 15px;
    background: #FFFFFF;
    margin: 10px;
    border-radius: 5px;
    display: inline-block;
    cursor pointer

</style>
