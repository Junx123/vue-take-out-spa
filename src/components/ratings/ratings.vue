<template>
    <div class="ratings" ref="ratings">
    <div>
        <div class="score-wrapper">
            <div class="overall-score">
                <div class="number">{{seller.score}}</div>
                <div class="text">综合评分</div>
                <div class="desc">高于周边{{seller.rankRate}}%的商家</div>
            </div>
            <div class="star-group">
                <div class="score-item">
                    <span class="text">服务态度</span>
                    <div class="star-wrapper">
                        <star :size="36" :score="seller.serviceScore"></star>
                    </div>
                    <span class="score-text">{{seller.serviceScore}}</span>
                </div>
                <div class="score-item">
                    <span class="text">食物评分</span>
                    <div class="star-wrapper">
                        <star :size="36" :score="seller.foodScore"></star>
                    </div>
                    <span class="score-text">{{seller.foodScore}}</span>
                </div>
                <div class="delivery-time">
                    <span class="text">送达时间</span>
                    <span class="time">{{seller.deliveryTime}}分钟</span>
                </div>
            </div>
        </div>
        <split></split>
        <ratingselect @select="changeType" @toggle="changeContent" :ratings="ratings" :select-type="selectType" :show-flag="showFlag" :only-content="onlyContent" :desc="desc"></ratingselect>
        <div class="rating-wrapper">
            <ul v-if="ratings && ratings.length">
                <li v-for="rating in ratings" v-show="showRating(rating.rateType, rating.text)" class="rating-item">
                    <div class="user-avatar">
                        <img :src="rating.avatar" width="28px" height="28px" class="avatar">
                    </div>
                    <div class="content">
                        <div class="username">
                            <span class="name">{{rating.username}}</span>
                        </div>
                        <div class="time">{{rating.rateTime | formatDate}}</div>
                        <div>
                            <div class="star-wrapper">
                                <star :size="24" :score="rating.score"></star>
                            </div>
                        </div>
                        <p class="text">
                            {{rating.text}}
                        </p>
                        <div class="tag-wrapper">
                            <span class="icon" :class="{'icon-thumb_up': rating.rateType===0, 'icon-thumb_down': rating.rateType===1}"></span>
                            <span class="tag" v-for="recommend in rating.recommend">{{recommend}}</span>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="no-rating" v-else>暂无评价</div>
        </div>
        </div>
    </div>
</template>

<script>
    import star from '../star/star.vue';
    import split from '../split/split.vue';
    import ratingselect from '../ratingselect/ratingselect.vue';
    import {formatDate} from '../../common/js/date.js';
    import BScroll from 'better-scroll';

    const ALL = 2;
    const ERR_OK = 0;
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data () {
            return {
                ratings: [],
                showFlag: false,
                selectType: ALL,
                onlyContent: false,
                desc: {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                }
            };
        },
        created () {
            this.$http.get('/api/ratings').then((response) => {
                response = response.body;
                if (response.errno === ERR_OK) {
                    this.ratings = response.data;
                }
                this.$nextTick(() => {
                    this.scroll = new BScroll(this.$refs.ratings, {
                    click: true
                    });
                });
                console.log(1);
            });
        },
        methods: {
            showRating (type, text) {
                if (this.onlyContent && !text) {
                    return false;
                }
                if (this.selectType === ALL) {
                    return true;
                } else {
                    return type === this.selectType;
                }
            },
            changeType (type) {
                this.selectType = type;
                this.$nextTick(() => {
                    this.scroll.refresh();
                    this.scroll.scrollToElement(this.$refs.foodRatings, 300);
                });
            },
            changeContent (content) {
                this.onlyContent = !this.onlyContent;
                this.$nextTick(() => {
                    this.scroll.refresh();
                    this.scroll.scrollToElement(this.$refs.foodRatings, 300);
                });
            }
        },
        filters: {
            formatDate (time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
        },
        components: {
            star,
            split,
            ratingselect
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl";
    .ratings
        position: absolute
        top: 174px
        bottom: 0
        width: 100%
        overflow: hidden
        .score-wrapper
            display: flex
            padding: 18px 0
            border-1px(rgba(7, 17, 27, 0.1))
            .overall-score
                flex: 1
                text-align: center
                border-right-1px(rgba(7, 17, 27, 0.1))
                .number
                    font-size: 24px
                    color: rgb(255, 153, 0)
                    line-height: 28px
                .text
                    margin: 6px 0 8px 0
                    font-size: 12px
                    color: rgb(7, 17, 27)
                    line-height: 12px
                .desc
                    margin-bottom: 6px
                    font-size: 10px
                    color: rgb(147, 153, 159)
                    line-height: 10px
            .star-group
                width: 237px
                padding: 0 20px
                box-sizing: border-box
                font-size: 0
                .score-item, .delivery-time
                    margin-bottom: 8px
                    font-size: 12px
                    color: rgb(7, 17, 27)
                    vertical-align: bottom
                    .text
                        display: inline-block
                        margin-right: 12px
                        line-height: 18px
                        vertical-align: top
                    .star-wrapper
                        display: inline-block
                        margin-right: 12px
                    .score-text
                        line-height: 18px
                        color: rgb(255, 153, 0)
                        vertical-align: top
                .delivery-time
                    margin-bottom: 0
                    .time
                        font-size: 12px
                        color: rgb(147, 153, 159)
                        line-height: 18px
        .rating-wrapper
            .rating-item
                position: relative
                margin: 0 18px
                padding: 18px 0
                border-1px(rgba(7, 17, 27, 0.1))
                .user-avatar
                    position: absolute
                    top: 20px
                    .avatar
                        border-radius: 50%
                .content
                    margin-left: 40px
                    .username
                        margin-bottom: 4px
                        .name
                            font-size: 10px
                            color: rgb(7, 17, 27)
                            line-height: 12px
                    .time
                        position: absolute
                        right: 18px
                        top: 18px
                        font-size: 10px
                        font-weight: 200
                        color: rgb(147, 153, 159)
                        line-height: 12px
                    .text
                        margin-bottom: 8px
                        font-size: 12px
                        font-weight: 200
                        color: rgb(7, 17, 27)
                        line-height: 18px
                    .star-wrapper
                        display: inline-block
                        margin-bottom: 6px
                        .star
                            margin-right: 6px
                    .tag-wrapper
                        .icon
                            margin-right: 8px
                            font-size: 12px
                            line-height: 16px
                            &.icon-thumb_up
                                color: rgb(0, 160, 220)
                            &.icon-thumb_down
                                color: rgb(183, 187, 191)
                        .tag
                            display: inline-block
                            margin-right: 8px
                            padding: 0 6px
                            border: 1px solid rgba(7, 17, 27, 0.1)
                            border-radius: 2px
                            background-color:   rgb(255, 255, 255)
                            font-size: 9px
                            color: rgb(147, 153, 159)
                            line-height: 16px
</style>