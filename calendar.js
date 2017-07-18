"use strict";
(function () {
    /**
     * @1900-2100区间内的公历、农历互转
     * @charset UTF-8
     * @Author  Jea杨(JJonline@JJonline.Cn)
     * @Time    2014-7-21
     * @Time    2016-8-13 Fixed 2033hex、Attribution Annals
     * @Time    2016-9-25 Fixed lunar LeapMonth Param Bug
     * @Version 1.0.2
     * @公历转农历：calendar.solar2lunar(1987,11,01); //[you can ignore params of prefix 0]
     * @农历转公历：calendar.lunar2solar(1987,09,10); //[you can ignore params of prefix 0]
     */
    var calendar = {

        /**
         * 农历1900-2100的润大小信息表
         * @Array Of Property
         * @return Hex
         */
        lunarInfo: [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, //1900-1909
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, //1910-1919
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, //1920-1929
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, //1930-1939
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, //1940-1949
            0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
            0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
            0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
            0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
            0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
            0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
            0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
            0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
            0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
            0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
            /**Add By JJonline@JJonline.Cn**/
            0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
            0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
            0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
            0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
            0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
            0x0d520], //2100

        /**
         * 公历每个月份的天数普通表
         * @Array Of Property
         * @return Number
         */
        solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

        /**
         * 天干地支之天干速查表
         * @Array Of Property trans["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]
         * @return Cn string
         */
        Gan: ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],

        /**
         * 天干地支之地支速查表
         * @Array Of Property
         * @trans["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]
         * @return Cn string
         */
        Zhi: ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"],

        /**
         * 天干地支之地支速查表<=>生肖
         * @Array Of Property
         * @trans["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"]
         * @return Cn string
         */
        Animals: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],

        /**
         * 24节气速查表
         * @Array Of Property
         * @trans["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"]
         * @return Cn string
         */
        solarTerm: ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"],

        /**
         * 1900-2100各年的24节气日期速查表
         * @Array Of Property
         * @return 0x string For splice
         */
        sTermInfo: ['9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '9778397bd19801ec9210c965cc920e', '97b6b97bd19801ec95f8c965cc920f', '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd197c36c9210c9274c91aa', '97b6b97bd19801ec95f8c965cc920e', '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec95f8c965cc920e', '97bcf97c3598082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd07f595b0b6fc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '9778397bd19801ec9210c9274c920e', '97b6b97bd19801ec95f8c965cc920f', '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e', '97b6b97bd19801ec95f8c965cc920f', '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bd07f1487f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c91aa', '97b6b97bd197c36c9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e', '97b6b7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36b0b70c9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c91aa', '97b6b7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '977837f0e37f149b0723b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0723b06bd', '7f07e7f0e37f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd', '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd', '7f07e7f0e37f14998083b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14898082b0723b02d5', '7f07e7f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66aa89801e9808297c35', '665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e26665b66a449801e9808297c35', '665f67f0e37f1489801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722'],

        /**
         * 数字转中文速查表
         * @Array Of Property
         * @trans ['日','一','二','三','四','五','六','七','八','九','十']
         * @return Cn string
         */
        nStr1: ["日", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],

        /**
         * 日期转农历称呼速查表
         * @Array Of Property
         * @trans ['初','十','廿','卅']
         * @return Cn string
         */
        nStr2: ["初", "十", "廿", "卅"],

        /**
         * 月份转农历称呼速查表
         * @Array Of Property
         * @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
         * @return Cn string
         */
        nStr3: ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"],

        /**
         * 返回农历y年一整年的总天数
         * @param lunar Year
         * @return Number
         * @eg:var count = calendar.lYearDays(1987) ;//count=387
         */
        lYearDays: function lYearDays(y) {
            var i,
                sum = 348;
            for (i = 0x8000; i > 0x8; i >>= 1) {
                sum += calendar.lunarInfo[y - 1900] & i ? 1 : 0;
            }
            return sum + calendar.leapDays(y);
        },

        /**
         * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
         * @param lunar Year
         * @return Number (0-12)
         * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
         */
        leapMonth: function leapMonth(y) {
            //闰字编码 \u95f0
            return calendar.lunarInfo[y - 1900] & 0xf;
        },

        /**
         * 返回农历y年闰月的天数 若该年没有闰月则返回0
         * @param lunar Year
         * @return Number (0、29、30)
         * @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
         */
        leapDays: function leapDays(y) {
            if (calendar.leapMonth(y)) {
                return calendar.lunarInfo[y - 1900] & 0x10000 ? 30 : 29;
            }
            return 0;
        },

        /**
         * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
         * @param lunar Year
         * @return Number (-1、29、30)
         * @eg:var MonthDay = calendar.monthDays(1987,9) ;//MonthDay=29
         */
        monthDays: function monthDays(y, m) {
            if (m > 12 || m < 1) {
                return -1;
            } //月份参数从1至12，参数错误返回-1
            return calendar.lunarInfo[y - 1900] & 0x10000 >> m ? 30 : 29;
        },

        /**
         * 返回公历(!)y年m月的天数
         * @param solar Year
         * @return Number (-1、28、29、30、31)
         * @eg:var solarMonthDay = calendar.leapDays(1987) ;//solarMonthDay=30
         */
        solarDays: function solarDays(y, m) {
            if (m > 12 || m < 1) {
                return -1;
            } //若参数错误 返回-1
            var ms = m - 1;
            if (ms == 1) {
                //2月份的闰平规律测算后确认返回28或29
                return y % 4 == 0 && y % 100 != 0 || y % 400 == 0 ? 29 : 28;
            } else {
                return calendar.solarMonth[ms];
            }
        },

        /**
         * 农历年份转换为干支纪年
         * @param  lYear 农历年的年份数
         * @return Cn string
         */
        toGanZhiYear: function toGanZhiYear(lYear) {
            var ganKey = (lYear - 3) % 10;
            var zhiKey = (lYear - 3) % 12;
            if (ganKey == 0) ganKey = 10; //如果余数为0则为最后一个天干
            if (zhiKey == 0) zhiKey = 12; //如果余数为0则为最后一个地支
            return calendar.Gan[ganKey - 1] + calendar.Zhi[zhiKey - 1];
        },

        /**
         * 公历月、日判断所属星座
         * @param  cMonth [description]
         * @param  cDay [description]
         * @return Cn string
         */
        toAstro: function toAstro(cMonth, cDay) {
            var s = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
            var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
            return s.substr(cMonth * 2 - (cDay < arr[cMonth - 1] ? 2 : 0), 2) + "座"; //座
        },

        /**
         * 传入offset偏移量返回干支
         * @param offset 相对甲子的偏移量
         * @return Cn string
         */
        toGanZhi: function toGanZhi(offset) {
            return calendar.Gan[offset % 10] + calendar.Zhi[offset % 12];
        },

        /**
         * 传入公历(!)y年获得该年第n个节气的公历日期
         * @param y公历年(1900-2100)；n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起
         * @return day Number
         * @eg:var _24 = calendar.getTerm(1987,3) ;//_24=4;意即1987年2月4日立春
         */
        getTerm: function getTerm(y, n) {
            if (y < 1900 || y > 2100) {
                return -1;
            }
            if (n < 1 || n > 24) {
                return -1;
            }
            var _table = calendar.sTermInfo[y - 1900];
            var _info = [parseInt('0x' + _table.substr(0, 5)).toString(), parseInt('0x' + _table.substr(5, 5)).toString(), parseInt('0x' + _table.substr(10, 5)).toString(), parseInt('0x' + _table.substr(15, 5)).toString(), parseInt('0x' + _table.substr(20, 5)).toString(), parseInt('0x' + _table.substr(25, 5)).toString()];
            var _calday = [_info[0].substr(0, 1), _info[0].substr(1, 2), _info[0].substr(3, 1), _info[0].substr(4, 2), _info[1].substr(0, 1), _info[1].substr(1, 2), _info[1].substr(3, 1), _info[1].substr(4, 2), _info[2].substr(0, 1), _info[2].substr(1, 2), _info[2].substr(3, 1), _info[2].substr(4, 2), _info[3].substr(0, 1), _info[3].substr(1, 2), _info[3].substr(3, 1), _info[3].substr(4, 2), _info[4].substr(0, 1), _info[4].substr(1, 2), _info[4].substr(3, 1), _info[4].substr(4, 2), _info[5].substr(0, 1), _info[5].substr(1, 2), _info[5].substr(3, 1), _info[5].substr(4, 2)];
            return parseInt(_calday[n - 1]);
        },

        /**
         * 传入农历数字月份返回汉语通俗表示法
         * @param lunar month
         * @return Cn string
         * @eg:var cnMonth = calendar.toChinaMonth(12) ;//cnMonth='腊月'
         */
        toChinaMonth: function toChinaMonth(m) {
            // 月 => \u6708
            if (m > 12 || m < 1) {
                return -1;
            } //若参数错误 返回-1
            var s = calendar.nStr3[m - 1];
            s += "月"; //加上月字
            return s;
        },

        /**
         * 传入农历日期数字返回汉字表示法
         * @param lunar day
         * @return Cn string
         * @eg:var cnDay = calendar.toChinaDay(21) ;//cnMonth='廿一'
         */
        toChinaDay: function toChinaDay(d) {
            //日 => \u65e5
            var s;
            switch (d) {
                case 10:
                    s = "初十";break;
                case 20:
                    s = "二十";break;
                    break;
                case 30:
                    s = "三十";break;
                    break;
                default:
                    s = calendar.nStr2[Math.floor(d / 10)];
                    s += calendar.nStr1[d % 10];
            }
            return s;
        },

        /**
         * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
         * @param y year
         * @return Cn string
         * @eg:var animal = calendar.getAnimal(1987) ;//animal='兔'
         */
        getAnimal: function getAnimal(y) {
            return calendar.Animals[(y - 4) % 12];
        },

        /**
         * 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
         * @param y  solar year
         * @param m  solar month
         * @param d  solar day
         * @return JSON object
         * @eg:console.log(calendar.solar2lunar(1987,11,01));
         */
        solar2lunar: function solar2lunar(y, m, d) {
            //参数区间1900.1.31~2100.12.31
            if (y < 1900 || y > 2100) {
                return -1;
            } //年份限定、上限
            if (y == 1900 && m == 1 && d < 31) {
                return -1;
            } //下限
            if (!y) {
                //未传参  获得当天
                var objDate = new Date();
            } else {
                var objDate = new Date(y, parseInt(m) - 1, d);
            }
            var i,
                leap = 0,
                temp = 0;
            //修正ymd参数
            var y = objDate.getFullYear(),
                m = objDate.getMonth() + 1,
                d = objDate.getDate();
            var offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
            for (i = 1900; i < 2101 && offset > 0; i++) {
                temp = calendar.lYearDays(i);offset -= temp;
            }
            if (offset < 0) {
                offset += temp;i--;
            }

            //是否今天
            var isTodayObj = new Date(),
                isToday = false;
            if (isTodayObj.getFullYear() == y && isTodayObj.getMonth() + 1 == m && isTodayObj.getDate() == d) {
                isToday = true;
            }
            //星期几
            var nWeek = objDate.getDay(),
                cWeek = calendar.nStr1[nWeek];
            if (nWeek == 0) {
                nWeek = 7;
            } //数字表示周几顺应天朝周一开始的惯例
            //农历年
            var year = i;

            var leap = calendar.leapMonth(i); //闰哪个月
            var isLeap = false;

            //效验闰月
            for (i = 1; i < 13 && offset > 0; i++) {
                //闰月
                if (leap > 0 && i == leap + 1 && isLeap == false) {
                    --i;
                    isLeap = true;temp = calendar.leapDays(year); //计算农历闰月天数
                } else {
                    temp = calendar.monthDays(year, i); //计算农历普通月天数
                }
                //解除闰月
                if (isLeap == true && i == leap + 1) {
                    isLeap = false;
                }
                offset -= temp;
            }

            if (offset == 0 && leap > 0 && i == leap + 1) if (isLeap) {
                isLeap = false;
            } else {
                isLeap = true;--i;
            }
            if (offset < 0) {
                offset += temp;--i;
            }
            //农历月
            var month = i;
            //农历日
            var day = offset + 1;

            //天干地支处理
            var sm = m - 1;
            var gzY = calendar.toGanZhiYear(year);

            //月柱 1900年1月小寒以前为 丙子月(60进制12)
            var firstNode = calendar.getTerm(year, m * 2 - 1); //返回当月「节」为几日开始
            var secondNode = calendar.getTerm(year, m * 2); //返回当月「节」为几日开始

            //依据12节气修正干支月
            var gzM = calendar.toGanZhi((y - 1900) * 12 + m + 11);
            if (d >= firstNode) {
                gzM = calendar.toGanZhi((y - 1900) * 12 + m + 12);
            }

            //传入的日期的节气与否
            var isTerm = false;
            var Term = null;
            if (firstNode == d) {
                isTerm = true;
                Term = calendar.solarTerm[m * 2 - 2];
            }
            if (secondNode == d) {
                isTerm = true;
                Term = calendar.solarTerm[m * 2 - 1];
            }
            //日柱 当月一日与 1900/1/1 相差天数
            var dayCyclical = Date.UTC(y, sm, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
            var gzD = calendar.toGanZhi(dayCyclical + d - 1);
            //该日期所属的星座
            var astro = calendar.toAstro(m, d);

            return { 'lYear': year, 'lMonth': month, 'lDay': day, 'Animal': calendar.getAnimal(year), 'IMonthCn': (isLeap ? "闰" : '') + calendar.toChinaMonth(month), 'IDayCn': calendar.toChinaDay(day), 'cYear': y, 'cMonth': m, 'cDay': d, 'gzYear': gzY, 'gzMonth': gzM, 'gzDay': gzD, 'isToday': isToday, 'isLeap': isLeap, 'nWeek': nWeek, 'ncWeek': "星期" + cWeek, 'isTerm': isTerm, 'Term': Term, 'astro': astro };
        },

        /**
         * 传入农历年月日以及传入的月份是否闰月获得详细的公历、农历object信息 <=>JSON
         * @param y  lunar year
         * @param m  lunar month
         * @param d  lunar day
         * @param isLeapMonth  lunar month is leap or not.[如果是农历闰月第四个参数赋值true即可]
         * @return JSON object
         * @eg:console.log(calendar.lunar2solar(1987,9,10));
         */
        lunar2solar: function lunar2solar(y, m, d, isLeapMonth) {
            //参数区间1900.1.31~2100.12.1
            var isLeapMonth = !!isLeapMonth;
            var leapOffset = 0;
            var leapMonth = calendar.leapMonth(y);
            var leapDay = calendar.leapDays(y);
            if (isLeapMonth && leapMonth != m) {
                return -1;
            } //传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
            if (y == 2100 && m == 12 && d > 1 || y == 1900 && m == 1 && d < 31) {
                return -1;
            } //超出了最大极限值
            var day = calendar.monthDays(y, m);
            var _day = day;
            //bugFix 2016-9-25
            //if month is leap, _day use leapDays method
            if (isLeapMonth) {
                _day = calendar.leapDays(y, m);
            }
            if (y < 1900 || y > 2100 || d > _day) {
                return -1;
            } //参数合法性效验

            //计算农历的时间差
            var offset = 0;
            for (var i = 1900; i < y; i++) {
                offset += calendar.lYearDays(i);
            }
            var leap = 0,
                isAdd = false;
            for (var i = 1; i < m; i++) {
                leap = calendar.leapMonth(y);
                if (!isAdd) {
                    //处理闰月
                    if (leap <= i && leap > 0) {
                        offset += calendar.leapDays(y);isAdd = true;
                    }
                }
                offset += calendar.monthDays(y, i);
            }
            //转换闰月农历 需补充该年闰月的前一个月的时差
            if (isLeapMonth) {
                offset += day;
            }
            //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
            var stmap = Date.UTC(1900, 1, 30, 0, 0, 0);
            var calObj = new Date((offset + d - 31) * 86400000 + stmap);
            var cY = calObj.getUTCFullYear();
            var cM = calObj.getUTCMonth() + 1;
            var cD = calObj.getUTCDate();

            return calendar.solar2lunar(cY, cM, cD);
        }
    };


    var html=
        '    <div class="calendar">'+
        '        <div>'+
        '            <div class="calendar-tools">'+
        '                <span class="calendar-prev" @click="prev">'+
        '                    <svg width="20" height="20" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+
        '                    <g class="transform-group">'+
        '                        <g transform="scale(0.015625, 0.015625)">'+
        '                            <path d="M671.968 912c-12.288 0-24.576-4.672-33.952-14.048L286.048 545.984c-18.752-18.72-18.752-49.12 0-67.872l351.968-352c18.752-18.752 49.12-18.752 67.872 0 18.752 18.72 18.752 49.12 0 67.872l-318.016 318.048 318.016 318.016c18.752 18.752 18.752 49.12 0 67.872C696.544 907.328 684.256 912 671.968 912z" fill="#5e7a88"></path>'+
        '                        </g>'+
        '                    </g>'+
        '                    </svg>'+
        '                </span>'+
        '                <span class="calendar-next"  @click="next">'+
        '                    <svg width="20" height="20" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+
        '                    <g class="transform-group">'+
        '                        <g transform="scale(0.015625, 0.015625)">'+
        '                            <path d="M761.056 532.128c0.512-0.992 1.344-1.824 1.792-2.848 8.8-18.304 5.92-40.704-9.664-55.424L399.936 139.744c-19.264-18.208-49.632-17.344-67.872 1.888-18.208 19.264-17.376 49.632 1.888 67.872l316.96 299.84-315.712 304.288c-19.072 18.4-19.648 48.768-1.248 67.872 9.408 9.792 21.984 14.688 34.56 14.688 12 0 24-4.48 33.312-13.44l350.048-337.376c0.672-0.672 0.928-1.6 1.6-2.304 0.512-0.48 1.056-0.832 1.568-1.344C757.76 538.88 759.2 535.392 761.056 532.128z" fill="#5e7a88"></path>'+
        '                        </g>'+
        '                    </g>'+
        '                    </svg>'+
        '                </span>'+
        '                <div class="calendar-info">'+
        '                    <!-- {{monthString}} -->'+
        '                    <div class="month">'+
        '                        <div class="month-inner" :style="{\'top\':-(this.month*20)+\'px\'}">'+
        '                            <span v-for="m in months">{{m}}</span>'+
        '                        </div>'+
        '                    </div>'+
        '                    <div class="year">{{year}}</div>'+
        '                </div>'+
        '            </div>'+
        '            <table cellpadding="5">'+
        '            <thead>'+
        '                <tr>'+
        '                    <td v-for="week in weeks" class="week">{{week}}</td>'+
        '                </tr>'+
        '            </thead>'+
        '            <tr v-for="(day,k1) in days">'+
        '                <td v-for="(child,k2) in day" :class="{\'selected\':child.selected,\'disabled\':child.disabled}" @click="select(k1,k2,$event)">'+
        '                    <span :class="{\'red\':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar)}">{{child.day}}</span>'+
        '                    <div class="text" v-if="child.eventName!=undefined">{{child.eventName}}</div>'+
        '                    <div class="text" :class="{\'isLunarFestival\':child.isLunarFestival,\'isGregorianFestival\':child.isGregorianFestival}" v-if="lunar">{{child.lunar}}</div>'+
        '                </td>'+
        '            </tr>'+
        '            </table>'+
        '        </div>'+
        '    </div>';

    var css='.calendar {'+
        '    margin:auto;'+
        '    width: 100%;'+
        '    min-width:300px;'+
        '    background: #fff;'+
        '    font-family: "PingFang SC","Hiragino Sans GB","STHeiti","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;'+
        '    user-select:none;'+
        '}'+
        '.calendar-tools{'+
        '    height:40px;'+
        '    font-size: 20px;'+
        '    line-height: 40px;'+
        '    color:#5e7a88;'+
        '}'+
        '.calendar-tools span{'+
        '    cursor: pointer;'+
        '}'+
        '.calendar-prev{'+
        '    width: 14.28571429%;'+
        '    float:left;'+
        '    text-align: center;'+
        '}'+
        '.calendar-info{'+
        '    padding-top: 3px;'+
        '    font-size:16px;'+
        '    line-height: 1.3;'+
        '    text-align: center;'+
        '}'+
        '.calendar-info>div.month{'+
        '    margin:auto;'+
        '    height:20px;'+
        '    width:100px;'+
        '    text-align: center;'+
        '    color:#5e7a88;'+
        '    overflow: hidden;'+
        '    position: relative;'+
        '}'+
        '.calendar-info>div.month .month-inner{'+
        '    position: absolute;'+
        '    left:0;'+
        '    top:0;'+
        '    height:240px;'+
        '    transition:top .5s cubic-bezier(0.075, 0.82, 0.165, 1);'+
        '}'+
        '.calendar-info>div.month .month-inner>span{'+
        '    display: block;'+
        '    height:20px;'+
        '    width:100px;'+
        '    text-align: center;'+
        '}'+
        '.calendar-info>div.year{'+
        '   font-size:10px;'+
        '   line-height: 1;'+
        '   color:#999;'+
        '}'+
        '.calendar-next{'+
        '    width: 14.28571429%;'+
        '    float:right;'+
        '    text-align: center;'+
        '}'+
        ' '+
        '.calendar table {'+
        '    clear: both;'+
        '    width: 100%;'+
        '    margin-bottom:10px;'+
        '    border-collapse: collapse;'+
        '    color: #444444;'+
        '}'+
        '.calendar td {'+
        '    margin:2px !important;'+
        '    padding:0px 0;'+
        '    width: 14.28571429%;'+
        '    height:44px;'+
        '    text-align: center;'+
        '    vertical-align: middle;'+
        '    font-size:14px;'+
        '    line-height: 125%;'+
        '    cursor: pointer;'+
        '    position: relative;'+
        '    vertical-align: top;'+
        '}'+
        '.calendar td.week{'+
        '    font-size:10px;'+
        '    pointer-events:none !important;'+
        '    cursor: default !important;    '+
        '}'+
        '.calendar td.disabled {'+
        '    color: #ccc;'+
        '    pointer-events:none !important;'+
        '    cursor: default !important;'+
        '}'+
        '.calendar td.disabled div{'+
        '    color: #ccc;'+
        '}'+
        '.calendar td span{'+
        '    display:block;'+
        '    max-width:40px;'+
        '    height:26px;'+
        '    font-size: 16px;'+
        '    line-height:26px;'+
        '    margin:0px auto;'+
        '    border-radius:2px;'+
        '}'+
        '.calendar td:not(.selected) span:not(.red):hover{'+
        '    background:#f3f8fa;'+
        '    color:#444;'+
        '}'+
        '.calendar td:not(.selected) span.red:hover{'+
        '    background:#f9efef;'+
        '}'+
        '.calendar td:not(.disabled) span.red{'+
        '    color:#ea6151;'+
        '}'+
        '.calendar td.selected span{'+
        '    background-color: #5e7a88;'+
        '    color: #fff;'+
        '}'+
        '.calendar td .text{'+
        '    position: absolute;'+
        '    top:28px;'+
        '    left:0;'+
        '    width:40px;'+
        '    text-align: center;'+
        '    border-radius: 2px;'+
        '    padding:2px;'+
        '    font-size:8px;'+
        '    line-height: 1.2;'+
        '    color:#444;'+
        '}'+
        '.calendar td .isGregorianFestival,'+
        '.calendar td .isLunarFestival{'+
        '    color:#ea6151;'+
        '}'+
        '.calendar td.selected span.red{'+
        '    background-color: #ea6151;'+
        '    color: #fff;'+
        '}'+
        '.calendar td.selected span.red:hover{'+
        '    background-color: #ea6151;'+
        '    color: #fff;'+
        '}'+
        '.calendar thead td {'+
        '  text-transform: uppercase;'+
        '  height:30px;'+
        '  vertical-align: middle;'+
        '}'+
        '.calendar-button{'+
        '    text-align: center;'+
        '}'+
        '.calendar-button span{'+
        '    cursor: pointer;'+
        '    display: inline-block;'+
        '    min-height: 1em;'+
        '    min-width: 5em;'+
        '    vertical-align: baseline;'+
        '    background:#5e7a88;'+
        '    color:#fff;'+
        '    margin: 0 .25em 0 0;'+
        '    padding: .6em 2em;'+
        '    font-size: 1em;'+
        '    line-height: 1em;'+
        '    text-align: center;'+
        '    border-radius: .3em;'+
        '}'+
        '.calendar-button span.cancel{'+
        '    background:#efefef;'+
        '    color:#666;'+
        '}';
    var style=document.createElement('style');
    style.innerText=css;
    document.body.append(style);
    var vueCalendar = {
        template:html,
        props: {
            value: {
                type: Array,
                'default': function _default() {
                    return [];
                }
            },
            begin: {
                type: Array,
                'default': function _default() {
                    return [];
                }
            },
            end: {
                type: Array,
                'default': function _default() {
                    return [];
                }
            },
            range: {
                type: Boolean,
                'default': false
            },
            zero: {
                type: Boolean,
                'default': false
            },
            lunar: {
                type: Boolean,
                'default': false
            },
            weeks: {
                type: Array,
                'default': function _default() {
                    return window.navigator.language.toLowerCase() == "zh-cn" ? ['日', '一', '二', '三', '四', '五', '六'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                }
            },
            months: {
                type: Array,
                'default': function _default() {
                    return window.navigator.language.toLowerCase() == "zh-cn" ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                }
            },
            events: {
                type: Object,
                'default': function _default() {
                    return {};
                }
            }
        },
        data: function data() {
            return {
                year: 0,
                month: 0,
                day: 0,
                days: [],
                today: [],
                festival: {
                    lunar: {
                        "1-1": "春节",
                        "1-15": "元宵节",
                        "2-2": "龙头节",
                        "5-5": "端午节",
                        "7-7": "七夕节",
                        "7-15": "中元节",
                        "8-15": "中秋节",
                        "9-9": "重阳节",
                        "10-1": "寒衣节",
                        "10-15": "下元节",
                        "12-8": "腊八节",
                        "12-23": "祭灶节"
                    },
                    gregorian: {
                        "1-1": "元旦",
                        "2-14": "情人节",
                        "3-8": "妇女节",
                        "3-12": "植树节",
                        "4-5": "清明节",
                        "5-1": "劳动节",
                        "5-4": "青年节",
                        "6-1": "儿童节",
                        "7-1": "建党节",
                        "8-1": "建军节",
                        "9-10": "教师节",
                        "10-1": "国庆节",
                        "12-24": "平安夜",
                        "12-25": "圣诞节"
                    }
                },
                rangeBegin: [],
                rangeEnd: []
            };
        },
        mounted: function mounted() {
            this.init();
        },
        methods: {
            // 初始化一些东西
            init: function init() {
                var now = new Date();
                // 没有默认值
                this.year = now.getFullYear();
                this.month = now.getMonth();
                this.day = now.getDate();
                if (this.value.length > 0) {
                    if (this.range) {
                        this.year = parseInt(this.value[0][0]);
                        this.month = parseInt(this.value[0][1]) - 1;
                        this.day = parseInt(this.value[0][2]);

                        var year2 = parseInt(this.value[1][0]);
                        var month2 = parseInt(this.value[1][1]) - 1;
                        var day2 = parseInt(this.value[1][2]);

                        this.rangeBegin = [this.year, this.month, this.day];
                        this.rangeEnd = [year2, month2, day2];
                        // console.log(this.month,this.rangeBegin,this.rangeEnd)
                    } else {
                        this.year = parseInt(this.value[0]);
                        this.month = parseInt(this.value[1]) - 1;
                        this.day = parseInt(this.value[2]);
                    }
                }
                this.render(this.year, this.month);
            },
            // 渲染日期
            render: function render(y, m) {
                var firstDayOfMonth = new Date(y, m, 1).getDay(); //当月第一天
                var lastDateOfMonth = new Date(y, m + 1, 0).getDate(); //当月最后一天
                var lastDayOfLastMonth = new Date(y, m, 0).getDate(); //最后一月的最后一天
                this.year = y;
                var seletSplit = this.value;
                var i = undefined,
                    line = 0,
                    temp = [];
                for (i = 1; i <= lastDateOfMonth; i++) {
                    var dow = new Date(y, m, i).getDay();
                    var k = undefined;
                    // 第一行
                    if (dow == 0) {
                        temp[line] = [];
                    } else if (i == 1) {
                        temp[line] = [];
                        k = lastDayOfLastMonth - firstDayOfMonth + 1;
                        for (var j = 0; j < firstDayOfMonth; j++) {
                            // console.log("第一行",lunarYear,lunarMonth,lunarValue,lunarInfo)
                            temp[line].push(Object.assign({ day: k, disabled: true }, this.getLunarInfo(this.month == 0 ? this.year - 1 : this.year, this.month == 0 ? 12 : this.month, k), this.getEvents(this.month == 0 ? this.year - 1 : this.year, this.month == 0 ? 12 : this.month, k)));
                            k++;
                        }
                    }

                    // 范围
                    if (this.range) {
                        // console.log("日期范围",this.getLunarInfo(this.year,this.month+1,i))
                        var options = Object.assign({ day: i }, this.getLunarInfo(this.year, this.month + 1, i), this.getEvents(this.year, this.month + 1, i));
                        if (this.rangeBegin.length > 0) {
                            var beginTime = Number(new Date(this.rangeBegin[0], this.rangeBegin[1], this.rangeBegin[2]));
                            var endTime = Number(new Date(this.rangeEnd[0], this.rangeEnd[1], this.rangeEnd[2]));
                            var stepTime = Number(new Date(this.year, this.month, i));
                            if (beginTime <= stepTime && endTime >= stepTime) {
                                options.selected = true;
                            }
                        }
                        if (this.begin.length > 0) {
                            var beginTime = Number(new Date(parseInt(this.begin[0]), parseInt(this.begin[1]) - 1, parseInt(this.begin[2])));
                            if (beginTime > Number(new Date(this.year, this.month, i))) options.disabled = true;
                        }
                        if (this.end.length > 0) {
                            var endTime = Number(new Date(parseInt(this.end[0]), parseInt(this.end[1]) - 1, parseInt(this.end[2])));
                            if (endTime < Number(new Date(this.year, this.month, i))) options.disabled = true;
                        }
                        temp[line].push(options);
                    } else {
                        // console.log(this.lunar(this.year,this.month,i));
                        // 单选模式
                        var chk = new Date();
                        var chkY = chk.getFullYear();
                        var chkM = chk.getMonth();
                        // 匹配上次选中的日期
                        if (parseInt(seletSplit[0]) == this.year && parseInt(seletSplit[1]) - 1 == this.month && parseInt(seletSplit[2]) == i) {
                            // console.log("匹配上次选中的日期",lunarYear,lunarMonth,lunarValue,lunarInfo)
                            temp[line].push(Object.assign({ day: i, selected: true }, this.getLunarInfo(this.year, this.month + 1, i), this.getEvents(this.year, this.month + 1, i)));
                            this.today = [line, temp[line].length - 1];
                        }
                        // 没有默认值的时候显示选中今天日期
                        else if (chkY == this.year && chkM == this.month && i == this.day && this.value == "") {

                            // console.log("今天",lunarYear,lunarMonth,lunarValue,lunarInfo)
                            temp[line].push(Object.assign({ day: i, selected: true }, this.getLunarInfo(this.year, this.month + 1, i), this.getEvents(this.year, this.month + 1, i)));
                            this.today = [line, temp[line].length - 1];
                        } else {
                            // 普通日期
                            // console.log("设置可选范围",i,lunarYear,lunarMonth,lunarValue,lunarInfo)
                            var options = Object.assign({ day: i, selected: false }, this.getLunarInfo(this.year, this.month + 1, i), this.getEvents(this.year, this.month + 1, i));
                            if (this.begin.length > 0) {
                                var beginTime = Number(new Date(parseInt(this.begin[0]), parseInt(this.begin[1]) - 1, parseInt(this.begin[2])));
                                if (beginTime > Number(new Date(this.year, this.month, i))) options.disabled = true;
                            }
                            if (this.end.length > 0) {
                                var endTime = Number(new Date(parseInt(this.end[0]), parseInt(this.end[1]) - 1, parseInt(this.end[2])));
                                if (endTime < Number(new Date(this.year, this.month, i))) options.disabled = true;
                            }
                            temp[line].push(options);
                        }
                    }
                    // 最后一行
                    if (dow == 6) {
                        line++;
                    } else if (i == lastDateOfMonth) {
                        var _k = 1;
                        for (dow; dow < 6; dow++) {
                            // console.log("最后一行",lunarYear,lunarMonth,lunarValue,lunarInfo)
                            temp[line].push(Object.assign({ day: _k, disabled: true }, this.getLunarInfo(this.month + 2 > 11 ? this.year + 1 : this.year, this.month + 2 > 11 ? 1 : this.month + 2, _k), this.getEvents(this.month + 2 > 11 ? this.year + 1 : this.year, this.month + 2 > 11 ? 1 : this.month + 2, _k)));
                            _k++;
                        }
                    }
                } //end for
                this.days = temp;
            },
            // 获取农历信息
            getLunarInfo: function getLunarInfo(y, m, d) {
                var lunarInfo = calendar.solar2lunar(y, m, d);
                var lunarValue = lunarInfo.IDayCn;
                // console.log(lunarInfo)
                var isLunarFestival = false;
                var isGregorianFestival = false;
                if (this.festival.lunar[lunarInfo.lMonth + "-" + lunarInfo.lDay] != undefined) {
                    lunarValue = this.festival.lunar[lunarInfo.lMonth + "-" + lunarInfo.lDay];
                    isLunarFestival = true;
                } else if (this.festival.gregorian[m + "-" + d] != undefined) {
                    lunarValue = this.festival.gregorian[m + "-" + d];
                    isGregorianFestival = true;
                }
                return {
                    lunar: lunarValue,
                    isLunarFestival: isLunarFestival,
                    isGregorianFestival: isGregorianFestival
                };
            },
            // 获取自定义事件
            getEvents: function getEvents(y, m, d) {
                if (Object.keys(this.events).length == 0) return false;
                if (this.events[y + "-" + m + "-" + d] != undefined) {
                    return {
                        eventName: this.events[y + "-" + m + "-" + d]
                    };
                }
                return {};
            },
            // 上月
            prev: function prev(e) {
                e.stopPropagation();
                if (this.month == 0) {
                    this.month = 11;
                    this.year = parseInt(this.year) - 1;
                } else {
                    this.month = parseInt(this.month) - 1;
                }
                this.render(this.year, this.month);
            },
            //  下月
            next: function next(e) {
                e.stopPropagation();
                if (this.month == 11) {
                    this.month = 0;
                    this.year = parseInt(this.year) + 1;
                } else {
                    this.month = parseInt(this.month) + 1;
                }
                this.render(this.year, this.month);
            },
            // 选中日期
            select: function select(k1, k2, e) {
                var _this = this;

                if (e != undefined) e.stopPropagation();
                // 日期范围
                if (this.range) {
                    if (this.rangeBegin.length == 0 || this.rangeEndTemp != 0) {
                        this.rangeBegin = [this.year, this.month, this.days[k1][k2].day];
                        this.rangeBeginTemp = this.rangeBegin;
                        this.rangeEnd = [this.year, this.month, this.days[k1][k2].day];
                        this.rangeEndTemp = 0;
                    } else {
                        (function () {
                            _this.rangeEnd = [_this.year, _this.month, _this.days[k1][k2].day];
                            _this.rangeEndTemp = 1;
                            // 判断结束日期小于开始日期则自动颠倒过来
                            if (+new Date(_this.rangeEnd[0], _this.rangeEnd[1], _this.rangeEnd[2]) < +new Date(_this.rangeBegin[0], _this.rangeBegin[1], _this.rangeBegin[2])) {
                                _this.rangeBegin = _this.rangeEnd;
                                _this.rangeEnd = _this.rangeBeginTemp;
                            }
                            // 小于10左边打补丁
                            var begin = [];
                            var end = [];
                            if (_this.zero) {
                                _this.rangeBegin.forEach(function (v, k) {
                                    if (k == 1) v = v + 1;
                                    begin.push(_this.zeroPad(v));
                                });
                                _this.rangeEnd.forEach(function (v, k) {
                                    if (k == 1) v = v + 1;
                                    end.push(_this.zeroPad(v));
                                });
                            } else {
                                begin = _this.rangeBegin;
                                end = _this.rangeEnd;
                            }
                            // console.log("选中日期",begin,end)
                            _this.$emit('select', begin, end);
                        })();
                    }
                    this.render(this.year, this.month);
                } else {
                    // 取消上次选中
                    if (this.today.length > 0) {
                        this.days.forEach(function (v) {
                            v.forEach(function (vv) {
                                vv.selected = false;
                            });
                        });
                    }
                    // 设置当前选中天
                    this.days[k1][k2].selected = true;
                    this.day = this.days[k1][k2].day;
                    this.today = [k1, k2];
                    this.$emit('select', [this.year, this.zero ? this.zeroPad(this.month + 1) : this.month + 1, this.zero ? this.zeroPad(this.days[k1][k2].day) : this.days[k1][k2].day]);
                }
            },
            // 日期补零
            zeroPad: function zeroPad(n) {
                return String(n < 10 ? '0' + n : n);
            }
        }
    };


    Vue.component('calendar', vueCalendar);
})();
