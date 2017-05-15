<template>
    <div class="seller" ref="seller">
        <div>
        <div class="intruduction-wrapper">
            <div class="intr">
                <h2 class="name">{{seller.name}}</h2>
                <div class="star-wrapper">
                    <star :size="36" :score="seller.score"></star>
                </div>
                <span class="sell">月售{{seller.sellCount}}</span>
                <div class="like">
                    <i class="icon-favorite"></i><br />
                    <span class="collect">收藏</span>
                </div>
            </div>
            <div class="delivery-infos">
                <div class="min-price">
                    <span class="title">起送价</span><br />
                    <span class="number">{{seller.minPrice}}</span>元
                </div>
                <div class="delivery-price">
                    <span class="title">商家配送</span><br />
                    <span class="number">{{seller.deliveryPrice}}</span>元
                </div>
                <div class="delivery-time">
                    <span class="title">平均配送时间</span><br />
                    <span class="number">{{seller.deliveryTime}}</span>分钟
                </div>
            </div>
        </div>
        <split></split>
        <div class="bulletin-wrapper">
            <div class="bulletin">
                <h2 class="title">公告与活动</h2>
                <p class="content">{{seller.bulletin}}</p>
            </div>
            <ul class="supports">
                <li v-for="(support, index) in  seller.supports" class="support">{{support.description}}</li>
            </ul>
        </div>
        <split></split>
        <div class="pics-wrapper">
            <h2 class="title">商家实景</h2>
            <ul class="pics">
                <li class="pic" v-for="(src, index) in seller.pics">
                    <img :src="src" width="120px" height="90px">
                </li>
            </ul>
        </div>
        <split></split>
        <div class="infos-wrapper">
            <h2 class="title">商家信息</h2>
            <ul class="infos">
                <li class="info"  v-for="(info, index) in seller.infos">{{info}}</li>
            </ul>
        </div>
        </div>
        <shopcart ref="shopcart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods"></shopcart>
    </div>
</template>

<script>
    import star from '../star/star';
    import split from '../split/split';
    import shopcart from '../shopcart/shopcart';
    import BScroll from 'better-scroll';

    export default {
        props: {
            seller: {
                type: Object
            },
            goods: {
                type: Array
            }
        },
        created () {
            this.$nextTick(() => {
                this.scroll = new BScroll(this.$refs.seller, {
                        click: true
                });
            });
        },
        updated () {
            this.scroll.refresh();
        },
        computed: {
            selectFoods () {
                let foods = [];
                this.goods.forEach((good) => {
                    good.foods.forEach((food) => {
                        if (food.count) {
                            foods.push(food);
                        }
                    });
                });
                return foods;
            }
        },
        components: {
            star,
            split,
            shopcart
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl"
    
    .seller
        position: absolute
        top: 174px
        bottom: 46px
        width: 100%
        overflow: hidden
        .intruduction-wrapper
            .intr
                position: relative
                padding: 18px 0
                margin: 0 18px
                font-size: 14px
                color: rgb(7, 17, 27)
                line-height: 14px
                border-1px(rgba(7, 17, 27, 0.1))
                .star-wrapper
                    display: inline-block
                    height: 18px
                .name
                    margin-bottom: 8px
                    font-size: 14px
                    color: rgb(7, 17, 27)
                    line-height: 14px
                .sell
                    margin-left: 12px
                    vertical-align: bottom
                    font-size: 10px
                    color: rgb(77, 85, 93)
                    line-height: 18px
                .like
                    position: absolute
                    top: 18px
                    right: 0
                    .icon-favorite
                        font-size: 24px
                        color: rgb(240, 20, 20)
                        line-height: 24px
                    .collect
                        display: inline-block
                        margin-top: 4px
                        font-size: 10px
                        color: rgb(77, 85, 93)
                        line-height: 10px
            .delivery-infos
                display: flex
                margin: 18px 0
                .min-price, .delivery-price, .delivery-time
                    flex: 1
                    border-right-1px(rgba(7, 17, 27, 0.1))
                    font-size: 10px
                    color: rgb(7, 17, 27)
                    text-align: center
                    .title
                        display: inline-block
                        margin-bottom: 4px
                        font-size: 10px
                        color: rgb(147, 153, 159)
                        line-height: 10px
                    .number
                        font-size: 24px
                        font-weight: 200
                        line-height: 24px
        .bulletin-wrapper
            margin: 18px 18px 0
            .bulletin
                padding: 0 12px 16px
                border-1px(rgba(7, 17, 27, 0.1))
                .title
                    margin-bottom: 8px
                    font-size: 14px
                    color: rgb(7, 17, 27)
                    line-height: 14px
                .content
                    font-size: 12px
                    font-weight: 200
                    color: rgb(240, 20, 20)
                    line-height: 24px
            .supports
                .support
                    padding: 16px 12px
                    height: 16px
                    font-size: 12px
                    font-weight: 200
                    color: rgb(7, 17, 27)
                    line-height: 16px
                    border-1px(rgba(7, 17, 27, 0.1))
                & :last-child
                    border-none()
        .pics-wrapper
            margin: 18px 0 18px 18px
            .title
                margin-bottom: 12px
                font-size: 14px
                color: rgb(7, 17, 27)
                line-height: 14px
            .pics
                white-space: nowrap
                overflow: hidden
                .pic
                    display: inline-block
                    margin-right: 6px
        .infos-wrapper
            margin: 18px
            .title
                padding-bottom: 12px
                font-size: 14px
                color: rgb(7, 17, 27)
                line-height: 14px
                border-1px(rgba(7, 17, 27, 0.1))
            .infos
                .info
                    padding: 16px 12px
                    font-size: 12px
                    font-weight: 200
                    color: rgb(7, 17, 27)
                    line-height: 16px
                    border-1px(rgba(7, 17, 27, 0.1))
                & :last-child
                    border-none()
</style>