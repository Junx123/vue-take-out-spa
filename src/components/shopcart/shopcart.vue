<template>
    <div class="shopcart">
        <div class="content">
            <div class="content-left">
                <div class="logo-wrapper" @click="toggleCart">
                    <div class="logo" :class="{'highlight': totalCount > 0}">
                        <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
                    </div>
                    <div class="num"  v-show="totalCount > 0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight': totalPrice > 0}">¥{{totalPrice}}</div>
                <div class="desc">另需配送费¥{{deliveryPrice}}</div>
            </div>
            <div class="content-right">
                <div class="pay" :class="{'enough': payDesc === '去结算'}">
                {{payDesc}}
                </div>
            </div>
        </div>
        <div class="ball-container">
                <div v-for="ball in balls">
                <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                    <div v-show="ball.show" class="ball">
                        <div class="inner inner-hook"></div>
                    </div>
                </transition>
                </div>
        </div>
        <transition name="up">
        <div v-show="cart" class="cart-wrapper">
            <div class="title-wrapper">
                <span class="title">购物车</span>
                <span class="clear-button" @click="cleanCart">清空</span>
            </div>
            <div class="cart-detail" ref="cartDetail">
                <ul>
                    <li class="food-item" v-for="food in selectFoods">
                        <div class="item-left">
                        <span class="text">{{food.name}}</span>
                        </div>
                        <div class="item-right">
                            <div class="price">¥{{food.price * food.count}}</div>
                            <div class="control">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        </transition>
        <transition name="fade">
        <div class="background" @click="closeCart" v-show="cart"></div>
        </transition>
    </div>
</template>

<script>
    import cartcontrol from '../cartcontrol/cartcontrol.vue';
    import BScroll from 'better-scroll';
    export default {
        props: {
            selectFoods: {
                type: Array,
                default () {
                    return [];
                }
            },
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
         data () {
            return {
                balls: [
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                }
                ],
                dropBalls: [],
                cart: false
            };
        },
        computed: {
            totalPrice () {
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                });
                return total;
            },
            totalCount () {
                let count = 0;
                this.selectFoods.forEach((food) => {
                    count += food.count;
                });
                return count;
            },
            payDesc () {
                if (this.totalPrice === 0) {
                    return `¥${this.minPrice}元起送`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差¥${diff}元`;
                } else {
                    return '去结算';
                }
            }
        },
        methods: {
            toggleCart () {
                if (this.selectFoods.length > 0) {
                    if (this.cart === false) {
                        this.$nextTick(() => {
                            this._initCartScroll();
                            this.cart = true;
                        });
                    } else {
                        this.cart = false;
                    }
                }
            },
            closeCart () {
                this.cart = false;
            },
            cleanCart () {
                this.selectFoods.forEach((food) => {
                    food.count = 0;
                });
                this.cart = false;
            },
            drop (el) {
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) {
                        ball.show = true;
                        ball.el = el;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            beforeEnter (el) {
                this.balls.forEach((ball) => {
                    if (ball.show) {
                        let rect = ball.el.getBoundingClientRect();
                        let x = rect.left - 32;
                        let y = -(window.innerHeight - rect.top - 22);
                        el.style.display = '';
                        el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                        el.style.tansform = `translate3d(0,${y}px,0)`;
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                        inner.style.transform = `translate3d(${x}px,0,0)`;
                    }
                });
            },
            enter (el, done) {
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight;
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.tansform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                    el.addEventListener('transitionend', done);
                });
            },
            afterEnter (el) {
                let ball = this.dropBalls.shift();
                if (ball) {
                    ball.show = false;
                    el.style.display = 'none';
                }
            },
            _initCartScroll () {
                /* 延迟等动画结束后执行 */
                setTimeout(() => {
                    if (!this.cartScroll) {
                        this.cartScroll = new BScroll(this.$refs.cartDetail, {
                            click: true
                        });
                    } else {
                        this.cartScroll.refresh();
                    }
                }, 100);
            }
        },
        components: {
            cartcontrol
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .shopcart
        position: fixed
        left: 0
        bottom: 0
        z-index: 50
        width: 100%
        height: 48px
        .content
            display: flex
            background: #141d27
            font-size: 0
            color: rgba(255, 255, 255, 0.4)
            .content-left
                flex: 1
                .logo-wrapper
                    display: inline-block
                    position: relative
                    top: -10px
                    margin: 0 12px
                    padding: 6px
                    width: 56px
                    height: 56px
                    box-sizing: border-box
                    vertical-align: top
                    border-radius: 50%
                    background: #141d27
                    .logo
                        width: 100%
                        height: 100%
                        border-radius: 50%
                        text-align: center
                        background: #2b343c
                        &.highlight
                            background: rgb(0, 160, 220)
                        .icon-shopping_cart
                            line-height: 44px
                            font-size: 24px
                            color: #80858a
                            &.highlight
                                color: #fff
                    .num
                        position: absolute
                        top: 0
                        right: 0
                        width: 24px
                        height: 16px
                        line-height: 16px
                        text-align: center
                        border-radius: 16px
                        font-size: 9px
                        font-weight: 700
                        color: #fff
                        background: rgb(240, 20, 20)
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
                .price
                    display: inline-block
                    vertical-align: top
                    margin-top: 12px
                    line-height: 24px
                    padding-right: 12px
                    box-sizing: border-box
                    border-right: 1px solid rgba(255, 255, 255, 0)
                    font-size: 16px
                    font-weight: 700
                    &.highlight
                        color: #fff
                .desc
                    display: inline-block
                    vertical-align: top
                    margin: 12px 0 0 12px
                    line-height: 24px
                    font-size: 10px
            .content-right
                flex: 0 0 105px
                width: 105px
                .pay
                    height: 48px
                    line-height: 48px
                    text-align: center
                    font-size: 12px
                    font-weight: 700
                    background: #2b333b
                    &.enough
                        background: #00b43c
                        color: #fff
        .ball-container
            .ball
                position: fixed
                left: 32px
                bottom: 22px
                z-index: 200
                transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
                .inner
                    width: 16px
                    height: 16px
                    border-radius: 50%
                    background: rgb(0, 160, 220)
                    transition: all 0.4s linear
        .cart-wrapper
            position: absolute
            bottom: 48px
            width: 100%
            transition: all 0.4s
            z-index: -1
            overflow: hidden
            &.up-enter-active, &.up-leave
                transform: translate3d(0, 0, 0)
            &.up-enter, &.up-leave-active
                transform: translate3d(0, 100%, 0)
            .title-wrapper
                border-bottom: 1px solid rgba(7, 17, 27, 0.1)
                height: 40px
                line-height: 40px
                padding: 0 18px
                background: #f3f5f7
                .title
                    font-size: 14px
                    font-weight: 200
                    color: rgb(7, 17, 27)
                .clear-button
                    position: absolute
                    right: 18px
                    font-size: 12px
                    color: rgb(0, 160, 220)
            .cart-detail
                max-height: 220px
                overflow: hidden
                background: #FFF
                .food-item
                    position: relative
                    padding: 12px 0
                    margin: 0 18px
                    border-bottom: 1px solid rgba(7, 17, 27, 0.1)
                    .item-left
                        display: inline-block
                        .text
                            font-size: 14px
                            color: rgb(7, 17, 27)
                            line-height: 24px
                    .item-right
                        position: absolute
                        right: 0
                        top: 0
                        margin-top: 14px
                        .price
                            display: inline-block
                            margin: 0 12px 0 18px 
                            font-size: 14px
                            font-weight: 700
                            color: rgb(240, 20, 20)
                            line-height: 24px
                            vertical-align: top
                        .control
                            display: inline-block
        .background
                position: fixed
                top: 0
                left: 0
                height: 100%
                width: 100%
                background: rgba(7, 17, 27, 0.6)
                z-index: -2
                transition: all 0.4s
                &.fade-enter-active, &.fade-leave
                    opacity: 1
                &.fade-enter, &.fade-leave-active
                    opacity: 0
</style>