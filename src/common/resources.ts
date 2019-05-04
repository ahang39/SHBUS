export class Resources {
    private static resources : Resources;
    static getInstance() : Resources {
        if(!this.resources) {
            this.resources = new Resources();
        }
        return this.resources;
    }
    public CLOSE = "关闭";
    public CONFIRM = '确认';
    public CANCEL = '取消';

    public PERSONAL_CENTER_PAGE_TITLE : string = "我的"
    public ENQUIRE_NEARBY_PAGE_TITLE : string = "附近车站";
    public HOME_TAB_NAME : string = "首页";
    public ENQUIRE_TAB_NAME : string = "查询";
    public CONTACT_TAB_NAME : string = "我的";

    public SEARCH_BUTTON_LABEL : string = "上海 ▼"
    public SEARCH_BUTTON_PLACEHOLDER : string = "线路";

    public NEAREST_STATION_LABEL : string = "离我最近";
    public DISTANCE_FROM_ME : string = "距离我";
    public KILOMETER : string = "千米";
    public METER : string = "米";

    public PULLING_TEXT : string = "下拉刷新";
    public REFRESHING_TEXT : string = "正在更新...";

    public GETTING_DATA : string = "正在获取...";
    public GETTING_TIMER : string = "正在计算时间";
    public GETTING_DISTANCE : string = "正在计算距离";
    public GETTING_STOP_REMAIN : string = "正在计算车辆位置";
    public NOT_YET_STARTED : string = "尚未发车";

    public TERMINAL_LABEL : string = "车牌号: ";
    public STOPDIS_LABEL : string = "剩余站数: ";
    public TIME_LABEL : string = "剩余时间: ";
    public DISTANCE_LABEL : string = "剩余距离: ";
    public HEADING_LABEL : string = "开往: ";

    public ENQUIRE_BTN : string = "查询";

    //ERROR CODE
    public GEO_LOCATION_FAILED : string = "获取位置失败";
    public BUSLINE_SEARCH_FAILED : string = "获取站点失败, 请稍后重试...";
    public STATION_TITLE_ERROR : string = "获取站点失败, 新重新进入";
    public DISTANCE_ERROR : string = "获取距离失败";
    public STOP_REMAIN_ERROR : string = "获取车辆位置失败";
    public TIME_ERROR : string = "获取时间失败";
}