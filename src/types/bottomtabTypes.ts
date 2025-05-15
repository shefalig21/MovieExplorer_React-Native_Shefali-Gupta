export interface BottomTabType{
    activeTab:string,
    handleNavigation:(screen:string)=>void,
    tabColor:(screen:string)=>string,
}