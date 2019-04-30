<template>
    <div class="admin">
        <Layout class="admin-layout">
            <Sider hide-trigger :style="{background: '#fff'}">
                <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
                    <Submenu name="1">
                        <template slot="title">
                            <i class="iconfont" >&#xe66c;</i>
                            七牛云
                        </template>
                        <MenuItem name="1-1">Option 1</MenuItem>
                        <MenuItem name="1-2">Option 2</MenuItem>
                        <MenuItem name="1-3">Option 3</MenuItem>
                    </Submenu>
                    <Submenu name="youpai">
                        <template slot="title">
                            <i class="iconfont" >&#xe634;</i>                            
                            又拍云
                        </template>
                    </Submenu>
                    <Submenu name="huawei">
                        <template slot="title">
                            <i class="iconfont" >&#xea16;</i>                            
                            华为云
                        </template>
                    </Submenu>                    
                    <Submenu name="ali">
                        <template slot="title">
                            <i class="iconfont" >&#xe641;</i>                            
                            阿里云
                        </template>
                    </Submenu>
                    <Submenu name="tengxun">
                        <template slot="title">
                            <i class="iconfont" >&#xe61a;</i>                            
                            腾讯云
                        </template>
                    </Submenu>
                    <Submenu name="baidu">
                        <template slot="title">
                            <i class="iconfont" >&#xe62b;</i>                            
                            百度云
                        </template>
                    </Submenu>
                    <Submenu name="qingyun">
                        <template slot="title">
                            <i class="iconfont" >&#xe6d0;</i>                            
                            青云
                        </template>
                    </Submenu>
                    <Submenu name="jingdong">
                        <template slot="title">
                            <i class="iconfont" >&#xe750;</i>                            
                            京东云
                        </template>
                    </Submenu>
                    <Submenu name="meituan">
                        <template slot="title">
                            <i class="iconfont" >&#xe74a;</i>                            
                            美团云
                        </template>
                    </Submenu>                    
                </Menu>
            </Sider>   
            <Layout :style="{padding: '0 24px 24px'}">
                <Breadcrumb :style="{margin: '24px 0'}">
                    <BreadcrumbItem>admin</BreadcrumbItem>
                    <BreadcrumbItem>qiniu</BreadcrumbItem>
                </Breadcrumb>
                <Content :style="{padding: '24px', minHeight: '918px', background: '#fff'}">
                    Content
                </Content>
            </Layout>                     
        </Layout>
    </div>
</template>
<script>
export default {
    name: 'admin'
}
</script>
<style lang="less">
    .admin{
        position: relative;
        width: 100%;
        min-height: 1010px;
        background-color: #EEFFFF;
        .admin-layout{
            width: 100%;
            height: 100%;
            .ivu-layout-sider{
                height: 100%;
            }
        }
    }
</style>
