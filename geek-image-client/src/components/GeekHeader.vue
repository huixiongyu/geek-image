<template>
    <div class="header">
        <div class="header-left">
            <router-link tag="div" to="/" class="logo">极客图床</router-link>
            <div class="upload nav-word" @click="handleToUp">
                <i class="iconfont">&#xe62e;</i>上传
            </div>
            <div class="nav-album nav-word" @click="handleToAlbum">
                <Dropdown @on-click="selectAlbum">
                    <i class="iconfont">&#xe646;</i>相册
                    <DropdownMenu slot="list">
                        <DropdownItem 
                            v-for="item in albumsInfo" 
                            :name="item.albumID"
                            :key="item.albumID">
                            {{item.name}}
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>    
            </div>
            <div class="manage nav-word" @click="handleToAdmin">
                <i class="iconfont">&#xe600;</i>控制台
            </div>
        </div>
        <div class="header-right">
            <div class="signin" @click="loginModal = true" v-if="!login">
                登录
            </div>
            <div class="sprit" v-if="!login">
                /
            </div>
            <div class="signup" @click="signupModal = true" v-if="!login">
                注册
            </div>
            <div class="cloud" v-if="login" @click="qiniuModal = true">
                <i class="iconfont">&#xe66c;</i>七牛云
            </div>
            <div class="logout" v-if="login">
                <Dropdown @on-click="handleSelectItem">
                    <img src="../assets/221.jpg" alt="">
                    <DropdownMenu slot="list">
                        <DropdownItem name="admin">控制面板</DropdownItem>
                        <DropdownItem name="logout">退出登录</DropdownItem>
                    </DropdownMenu>
                </Dropdown>        
            </div>
            <Modal width="360" v-model="loginModal" title="登录">
                <Form ref="formLogin" :model="formLogin" :rules="ruleLogin">
                    <FormItem prop="phoneNum">
                        <Input type="text" 
                        class="login-box"
                        placeholder="手机号码"
                        v-model="formLogin.phoneNum" />
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="password" 
                        placeholder="密码"
                        class="login-box"
                        v-model="formLogin.password" />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" 
                                class="login-btn"
                                @click="handleLogin('formLogin')">
                               登录
                        </Button>
                        <div class="to-signup">
                            <p>
                                <span>没有账号？</span>
                                <router-link to="/">注册</router-link>
                            </p>
                            <router-link @click.native="msmLogin" to='/'>忘记密码</router-link>
                        </div>
                    </FormItem>
                </Form>
                <p class="login-method">第三方账号登录：</p>
                <div class="loginimgs" slot="footer">
                    <div><img src="https://b-gold-cdn.xitu.io/v3/static/img/weibo.fa758eb.svg" alt=""></div>
                    <div><img src="https://b-gold-cdn.xitu.io/v3/static/img/wechat.e0ff124.svg" alt=""></div>
                    <div><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQ2cHgiIGhlaWdodD0iNDZweCIgdmlld0JveD0iMCAwIDQ2IDQ2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IHNrZXRjaHRvb2wgMy43LjEgKDI4MjE1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY29uX0dpdEh1YjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0i54q25oCBIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5rOo5YaMIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzU4LjAwMDAwMCwgLTYwMC4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDc1OC4wMDAwMDAsIDYwMC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMzE0IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNEOEQ4RDgiIHg9IjAiIHk9IjAiIHdpZHRoPSI0NiIgaGVpZ2h0PSI0NiI+PC9yZWN0PgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTUsMjMuNDMwNzU3NiBDNSwzMS4xMzE3NDk3IDEwLjEwMjQ5MjMsMzcuNjY0MjcxMiAxNy4xNzk1MDgsMzkuOTY5MTExNyBDMTguMDcwNTU4Miw0MC4xMjk2MTU5IDE4LjM5NTI3MjIsMzkuNTkxMzkxOCAxOC4zOTUyNzIyLDM5LjEyOTEzOTcgQzE4LjM5NTI3MjIsMzguNzE2MTA4OCAxOC4zNzk5NjU4LDM3LjYxOTMzIDE4LjM3MTIxOTMsMzYuMTY1MTYxOCBDMTMuNDE3NDE3NiwzNy4yMTgwNjk1IDEyLjM3MjIxMDMsMzMuODI4MjIwNSAxMi4zNzIyMTAzLDMzLjgyODIyMDUgQzExLjU2MjA2NTMsMzEuODE0NDI3NiAxMC4zOTQ0MDY5LDMxLjI3ODM0MzYgMTAuMzk0NDA2OSwzMS4yNzgzNDM2IEM4Ljc3NzM5Njc3LDMwLjE5NzYxNTIgMTAuNTE2ODU3OSwzMC4yMTkwMTU4IDEwLjUxNjg1NzksMzAuMjE5MDE1OCBDMTIuMzA0NDI0OCwzMC4zNDIwNjkgMTMuMjQ0Njc0MSwzMi4wMTU1OTI5IDEzLjI0NDY3NDEsMzIuMDE1NTkyOSBDMTQuODMzMjU4MSwzNC42Nzg4OTI4IDE3LjQxMzQ3NywzMy45MDk1NDI2IDE4LjQyODA3MTUsMzMuNDYzMzQwOSBDMTguNTg5ODgxOSwzMi4zMzc2NzE0IDE5LjA1MDE2NjcsMzEuNTY5MzkxMiAxOS41NTg1NTczLDMxLjEzMzg4OTggQzE1LjYwNDA0MzgsMzAuNjk0MTA4MiAxMS40NDYxNzQxLDI5LjE5ODIwOSAxMS40NDYxNzQxLDIyLjUxOTA5MzYgQzExLjQ0NjE3NDEsMjAuNjE2NTgzNyAxMi4xNDA0Mjc5LDE5LjA1OTY5MjggMTMuMjc5NjYwMSwxNy44NDIwMDA5IEMxMy4wOTU5ODM1LDE3LjQwMTE0OTMgMTIuNDg0ODIxNSwxNS42MjgxMTI3IDEzLjQ1NDU5MDIsMTMuMjI5MTA5OCBDMTMuNDU0NTkwMiwxMy4yMjkxMDk4IDE0Ljk0OTE0OTIsMTIuNzYwNDM3NSAxOC4zNTE1Mzk2LDE1LjAxNjA1NjcgQzE5Ljc3MTc1MzMsMTQuNjI4NzA2NSAyMS4yOTU4MzE4LDE0LjQzNjEwMTUgMjIuODEwMDcwNSwxNC40Mjg2MTEzIEMyNC4zMjMyMTU4LDE0LjQzNjEwMTUgMjUuODQ2MjAxLDE0LjYyODcwNjUgMjcuMjY4NjAxMywxNS4wMTYwNTY3IEMzMC42Njg4MDUxLDEyLjc2MDQzNzUgMzIuMTYxMTc3NCwxMy4yMjkxMDk4IDMyLjE2MTE3NzQsMTMuMjI5MTA5OCBDMzMuMTMzMTMyOCwxNS42MjgxMTI3IDMyLjUyMTk3MDgsMTcuNDAxMTQ5MyAzMi4zMzkzODc1LDE3Ljg0MjAwMDkgQzMzLjQ4MDgwNjQsMTkuMDU5NjkyOCAzNC4xNjk1OTM2LDIwLjYxNjU4MzcgMzQuMTY5NTkzNiwyMi41MTkwOTM2IEMzNC4xNjk1OTM2LDI5LjIxNTMyOTQgMzAuMDA1MTY0LDMwLjY4ODc1ODEgMjYuMDM4NjI0MSwzMS4xMTk5Nzk0IEMyNi42NzcxMTg5LDMxLjY1ODIwMzUgMjcuMjQ2NzM1LDMyLjcyMTgxMTUgMjcuMjQ2NzM1LDM0LjM0ODI1NDIgQzI3LjI0NjczNSwzNi42Nzc3MDUzIDI3LjIyNDg2ODgsMzguNTU3NzQ0NyAyNy4yMjQ4Njg4LDM5LjEyOTEzOTcgQzI3LjIyNDg2ODgsMzkuNTk1NjcxOSAyNy41NDYzMDI4LDQwLjEzODE3NjEgMjguNDQ5Mzc5NSwzOS45NjgwNDE3IEMzNS41MjA5Mjg2LDM3LjY1Nzg1MSA0MC42MTkwNDc2LDMxLjEyOTYwOTcgNDAuNjE5MDQ3NiwyMy40MzA3NTc2IEM0MC42MTkwNDc2LDEzLjgwMzcxNDkgMzIuNjQ0NDIxOCw2IDIyLjgwNzg4MzgsNiBDMTIuOTc0NjI1OCw2IDUsMTMuODAzNzE0OSA1LDIzLjQzMDc1NzYgWiIgaWQ9IkZpbGwtMyIgZmlsbD0iIzE2MTYxNCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" alt=""></div>
                </div>
            </Modal>
            <Modal width="360" v-model="signupModal"  title="注册">
                <Form ref="formSignup" :model="formSignup" :rules="ruleSignup" >
                    <FormItem prop="phoneNum">
                        <Input type="text" 
                        class="login-box"
                        placeholder="手机号码"
                        v-model="formSignup.phoneNum" />
                    </FormItem>
                    <FormItem>
                        <Button size="large" 
                                @click="getVerifyCode(formSignup.phoneNum)" 
                                :disabled="disabled"
                                type="default">
                            {{btnTitle}}
                        </Button>
                    </FormItem>
                    <FormItem prop="checkCode">
                        <Input type="text" 
                        placeholder="输入验证码"
                        class="login-box"
                        v-model="formSignup.checkCode" />
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="password" 
                        placeholder="密码"
                        class="login-box"
                        v-model="formSignup.password" />
                    </FormItem>
                    <FormItem prop="repeatPassword">
                        <Input type="password" 
                        placeholder="再次确认密码"
                        class="login-box"
                        v-model="formSignup.repeatPassword" />
                    </FormItem>                    
                    <FormItem>
                        <Button type="primary" 
                                class="login-btn"
                                @click="handleSignup('formSignup')">
                               注册
                        </Button>
                    </FormItem>
                </Form>
                <p class="login-method">第三方账号授权注册：</p>
                <div class="loginimgs" slot="footer">
                    <div><img src="https://b-gold-cdn.xitu.io/v3/static/img/weibo.fa758eb.svg" alt=""></div>
                    <div><img src="https://b-gold-cdn.xitu.io/v3/static/img/wechat.e0ff124.svg" alt=""></div>
                    <div><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQ2cHgiIGhlaWdodD0iNDZweCIgdmlld0JveD0iMCAwIDQ2IDQ2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IHNrZXRjaHRvb2wgMy43LjEgKDI4MjE1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY29uX0dpdEh1YjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0i54q25oCBIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5rOo5YaMIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzU4LjAwMDAwMCwgLTYwMC4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDc1OC4wMDAwMDAsIDYwMC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMzE0IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNEOEQ4RDgiIHg9IjAiIHk9IjAiIHdpZHRoPSI0NiIgaGVpZ2h0PSI0NiI+PC9yZWN0PgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTUsMjMuNDMwNzU3NiBDNSwzMS4xMzE3NDk3IDEwLjEwMjQ5MjMsMzcuNjY0MjcxMiAxNy4xNzk1MDgsMzkuOTY5MTExNyBDMTguMDcwNTU4Miw0MC4xMjk2MTU5IDE4LjM5NTI3MjIsMzkuNTkxMzkxOCAxOC4zOTUyNzIyLDM5LjEyOTEzOTcgQzE4LjM5NTI3MjIsMzguNzE2MTA4OCAxOC4zNzk5NjU4LDM3LjYxOTMzIDE4LjM3MTIxOTMsMzYuMTY1MTYxOCBDMTMuNDE3NDE3NiwzNy4yMTgwNjk1IDEyLjM3MjIxMDMsMzMuODI4MjIwNSAxMi4zNzIyMTAzLDMzLjgyODIyMDUgQzExLjU2MjA2NTMsMzEuODE0NDI3NiAxMC4zOTQ0MDY5LDMxLjI3ODM0MzYgMTAuMzk0NDA2OSwzMS4yNzgzNDM2IEM4Ljc3NzM5Njc3LDMwLjE5NzYxNTIgMTAuNTE2ODU3OSwzMC4yMTkwMTU4IDEwLjUxNjg1NzksMzAuMjE5MDE1OCBDMTIuMzA0NDI0OCwzMC4zNDIwNjkgMTMuMjQ0Njc0MSwzMi4wMTU1OTI5IDEzLjI0NDY3NDEsMzIuMDE1NTkyOSBDMTQuODMzMjU4MSwzNC42Nzg4OTI4IDE3LjQxMzQ3NywzMy45MDk1NDI2IDE4LjQyODA3MTUsMzMuNDYzMzQwOSBDMTguNTg5ODgxOSwzMi4zMzc2NzE0IDE5LjA1MDE2NjcsMzEuNTY5MzkxMiAxOS41NTg1NTczLDMxLjEzMzg4OTggQzE1LjYwNDA0MzgsMzAuNjk0MTA4MiAxMS40NDYxNzQxLDI5LjE5ODIwOSAxMS40NDYxNzQxLDIyLjUxOTA5MzYgQzExLjQ0NjE3NDEsMjAuNjE2NTgzNyAxMi4xNDA0Mjc5LDE5LjA1OTY5MjggMTMuMjc5NjYwMSwxNy44NDIwMDA5IEMxMy4wOTU5ODM1LDE3LjQwMTE0OTMgMTIuNDg0ODIxNSwxNS42MjgxMTI3IDEzLjQ1NDU5MDIsMTMuMjI5MTA5OCBDMTMuNDU0NTkwMiwxMy4yMjkxMDk4IDE0Ljk0OTE0OTIsMTIuNzYwNDM3NSAxOC4zNTE1Mzk2LDE1LjAxNjA1NjcgQzE5Ljc3MTc1MzMsMTQuNjI4NzA2NSAyMS4yOTU4MzE4LDE0LjQzNjEwMTUgMjIuODEwMDcwNSwxNC40Mjg2MTEzIEMyNC4zMjMyMTU4LDE0LjQzNjEwMTUgMjUuODQ2MjAxLDE0LjYyODcwNjUgMjcuMjY4NjAxMywxNS4wMTYwNTY3IEMzMC42Njg4MDUxLDEyLjc2MDQzNzUgMzIuMTYxMTc3NCwxMy4yMjkxMDk4IDMyLjE2MTE3NzQsMTMuMjI5MTA5OCBDMzMuMTMzMTMyOCwxNS42MjgxMTI3IDMyLjUyMTk3MDgsMTcuNDAxMTQ5MyAzMi4zMzkzODc1LDE3Ljg0MjAwMDkgQzMzLjQ4MDgwNjQsMTkuMDU5NjkyOCAzNC4xNjk1OTM2LDIwLjYxNjU4MzcgMzQuMTY5NTkzNiwyMi41MTkwOTM2IEMzNC4xNjk1OTM2LDI5LjIxNTMyOTQgMzAuMDA1MTY0LDMwLjY4ODc1ODEgMjYuMDM4NjI0MSwzMS4xMTk5Nzk0IEMyNi42NzcxMTg5LDMxLjY1ODIwMzUgMjcuMjQ2NzM1LDMyLjcyMTgxMTUgMjcuMjQ2NzM1LDM0LjM0ODI1NDIgQzI3LjI0NjczNSwzNi42Nzc3MDUzIDI3LjIyNDg2ODgsMzguNTU3NzQ0NyAyNy4yMjQ4Njg4LDM5LjEyOTEzOTcgQzI3LjIyNDg2ODgsMzkuNTk1NjcxOSAyNy41NDYzMDI4LDQwLjEzODE3NjEgMjguNDQ5Mzc5NSwzOS45NjgwNDE3IEMzNS41MjA5Mjg2LDM3LjY1Nzg1MSA0MC42MTkwNDc2LDMxLjEyOTYwOTcgNDAuNjE5MDQ3NiwyMy40MzA3NTc2IEM0MC42MTkwNDc2LDEzLjgwMzcxNDkgMzIuNjQ0NDIxOCw2IDIyLjgwNzg4MzgsNiBDMTIuOTc0NjI1OCw2IDUsMTMuODAzNzE0OSA1LDIzLjQzMDc1NzYgWiIgaWQ9IkZpbGwtMyIgZmlsbD0iIzE2MTYxNCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" alt=""></div>
                </div>
            </Modal> 
            <Modal
                v-model="msmLoginModal"
                width="400"
                title="短信登录">
                <Form ref="msmloginForm" :model="msmForm">
                    <FormItem prop="phoneNum">
                        <Input type="text" 
                        class="login-box"
                        placeholder="手机号码"
                        v-model="msmForm.phoneNum" />
                    </FormItem>
                    <FormItem>
                        <Row >
                            <i-col span="18">
                               <Input type="text" 
                                    placeholder="输入验证码"
                                    class="login-box"
                                    v-model="msmForm.msmCode" />
                            </i-col>
                            <i-col span="6">
                                <Button class="msm-btn"
                                        @click="getVerifyCode(msmForm.phoneNum)" 
                                        :disabled="disabled"
                                        type="info">
                                    {{btnTitle}}
                                </Button>                            
                            </i-col>
                        </Row>                        
                    </FormItem>
                    <FormItem>
                        <Button type="primary" 
                                class="login-btn"
                                @click="handleMsmSignin">
                               登录
                        </Button>
                    </FormItem>                    
                </Form>    
                <p class="login-method">第三方账号登录：</p>
                <div class="loginimgs" slot="footer">
                    <div><img src="https://b-gold-cdn.xitu.io/v3/static/img/weibo.fa758eb.svg" alt=""></div>
                    <div><img src="https://b-gold-cdn.xitu.io/v3/static/img/wechat.e0ff124.svg" alt=""></div>
                    <div><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQ2cHgiIGhlaWdodD0iNDZweCIgdmlld0JveD0iMCAwIDQ2IDQ2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IHNrZXRjaHRvb2wgMy43LjEgKDI4MjE1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY29uX0dpdEh1YjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0i54q25oCBIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5rOo5YaMIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzU4LjAwMDAwMCwgLTYwMC4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDc1OC4wMDAwMDAsIDYwMC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMzE0IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNEOEQ4RDgiIHg9IjAiIHk9IjAiIHdpZHRoPSI0NiIgaGVpZ2h0PSI0NiI+PC9yZWN0PgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTUsMjMuNDMwNzU3NiBDNSwzMS4xMzE3NDk3IDEwLjEwMjQ5MjMsMzcuNjY0MjcxMiAxNy4xNzk1MDgsMzkuOTY5MTExNyBDMTguMDcwNTU4Miw0MC4xMjk2MTU5IDE4LjM5NTI3MjIsMzkuNTkxMzkxOCAxOC4zOTUyNzIyLDM5LjEyOTEzOTcgQzE4LjM5NTI3MjIsMzguNzE2MTA4OCAxOC4zNzk5NjU4LDM3LjYxOTMzIDE4LjM3MTIxOTMsMzYuMTY1MTYxOCBDMTMuNDE3NDE3NiwzNy4yMTgwNjk1IDEyLjM3MjIxMDMsMzMuODI4MjIwNSAxMi4zNzIyMTAzLDMzLjgyODIyMDUgQzExLjU2MjA2NTMsMzEuODE0NDI3NiAxMC4zOTQ0MDY5LDMxLjI3ODM0MzYgMTAuMzk0NDA2OSwzMS4yNzgzNDM2IEM4Ljc3NzM5Njc3LDMwLjE5NzYxNTIgMTAuNTE2ODU3OSwzMC4yMTkwMTU4IDEwLjUxNjg1NzksMzAuMjE5MDE1OCBDMTIuMzA0NDI0OCwzMC4zNDIwNjkgMTMuMjQ0Njc0MSwzMi4wMTU1OTI5IDEzLjI0NDY3NDEsMzIuMDE1NTkyOSBDMTQuODMzMjU4MSwzNC42Nzg4OTI4IDE3LjQxMzQ3NywzMy45MDk1NDI2IDE4LjQyODA3MTUsMzMuNDYzMzQwOSBDMTguNTg5ODgxOSwzMi4zMzc2NzE0IDE5LjA1MDE2NjcsMzEuNTY5MzkxMiAxOS41NTg1NTczLDMxLjEzMzg4OTggQzE1LjYwNDA0MzgsMzAuNjk0MTA4MiAxMS40NDYxNzQxLDI5LjE5ODIwOSAxMS40NDYxNzQxLDIyLjUxOTA5MzYgQzExLjQ0NjE3NDEsMjAuNjE2NTgzNyAxMi4xNDA0Mjc5LDE5LjA1OTY5MjggMTMuMjc5NjYwMSwxNy44NDIwMDA5IEMxMy4wOTU5ODM1LDE3LjQwMTE0OTMgMTIuNDg0ODIxNSwxNS42MjgxMTI3IDEzLjQ1NDU5MDIsMTMuMjI5MTA5OCBDMTMuNDU0NTkwMiwxMy4yMjkxMDk4IDE0Ljk0OTE0OTIsMTIuNzYwNDM3NSAxOC4zNTE1Mzk2LDE1LjAxNjA1NjcgQzE5Ljc3MTc1MzMsMTQuNjI4NzA2NSAyMS4yOTU4MzE4LDE0LjQzNjEwMTUgMjIuODEwMDcwNSwxNC40Mjg2MTEzIEMyNC4zMjMyMTU4LDE0LjQzNjEwMTUgMjUuODQ2MjAxLDE0LjYyODcwNjUgMjcuMjY4NjAxMywxNS4wMTYwNTY3IEMzMC42Njg4MDUxLDEyLjc2MDQzNzUgMzIuMTYxMTc3NCwxMy4yMjkxMDk4IDMyLjE2MTE3NzQsMTMuMjI5MTA5OCBDMzMuMTMzMTMyOCwxNS42MjgxMTI3IDMyLjUyMTk3MDgsMTcuNDAxMTQ5MyAzMi4zMzkzODc1LDE3Ljg0MjAwMDkgQzMzLjQ4MDgwNjQsMTkuMDU5NjkyOCAzNC4xNjk1OTM2LDIwLjYxNjU4MzcgMzQuMTY5NTkzNiwyMi41MTkwOTM2IEMzNC4xNjk1OTM2LDI5LjIxNTMyOTQgMzAuMDA1MTY0LDMwLjY4ODc1ODEgMjYuMDM4NjI0MSwzMS4xMTk5Nzk0IEMyNi42NzcxMTg5LDMxLjY1ODIwMzUgMjcuMjQ2NzM1LDMyLjcyMTgxMTUgMjcuMjQ2NzM1LDM0LjM0ODI1NDIgQzI3LjI0NjczNSwzNi42Nzc3MDUzIDI3LjIyNDg2ODgsMzguNTU3NzQ0NyAyNy4yMjQ4Njg4LDM5LjEyOTEzOTcgQzI3LjIyNDg2ODgsMzkuNTk1NjcxOSAyNy41NDYzMDI4LDQwLjEzODE3NjEgMjguNDQ5Mzc5NSwzOS45NjgwNDE3IEMzNS41MjA5Mjg2LDM3LjY1Nzg1MSA0MC42MTkwNDc2LDMxLjEyOTYwOTcgNDAuNjE5MDQ3NiwyMy40MzA3NTc2IEM0MC42MTkwNDc2LDEzLjgwMzcxNDkgMzIuNjQ0NDIxOCw2IDIyLjgwNzg4MzgsNiBDMTIuOTc0NjI1OCw2IDUsMTMuODAzNzE0OSA1LDIzLjQzMDc1NzYgWiIgaWQ9IkZpbGwtMyIgZmlsbD0iIzE2MTYxNCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" alt=""></div>
                </div>
            </Modal>                  
            <Modal
                title="七牛对象存储"
                v-model="qiniuModal"
                class-name="vertical-center-modal">
                <Form class="qiniu-form" ref="qiniuForm" :model="qiniuInfo" :rules="rulesQiniu" :label-width="100">
                    <FormItem label="accessKey">
                        <Input type="text" v-model="qiniuInfo.accessKey" placeholder="AccessKey" />
                    </FormItem>
                    <FormItem label="secretKey">
                        <Input type="password" v-model="qiniuInfo.secretKey" placeholder="SecretKey" />
                    </FormItem>
                    <FormItem label="存储空间名">
                        <Input type="text" v-model="qiniuInfo.bucket" placeholder="Bucket"/>
                    </FormItem>
                    <FormItem label="存储区域">
                        <RadioGroup v-model="qiniuInfo.zone">
                            <Radio label="z0"><span>华东</span></Radio>
                            <Radio label="z1"><span>华北</span></Radio>
                            <Radio label="z2"><span>华南</span></Radio>
                            <Radio label="na0"><span>北美</span></Radio>     
                            <Radio label="as0"><span>东南亚</span></Radio>                          
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="绑定域名"  prop="url">
                        <Input type="text" v-model="qiniuInfo.url" placeholder="http://qiniu.hackslog.cn" />
                    </FormItem>
                </Form>
                <Button class="qiniu-modal-btn" @click="submitMotify" type="primary" slot="footer">确认修改</Button>
            </Modal>     
        </div>
    </div>
</template>
<script>
import jwt_decode from 'jwt-decode'
export default {
    name: 'Header',
    data(){
        const validateLoginPass = (rule, value, callback) => {
            if(value === ''){
                callback(new Error('密码不能为空'));
            }else if(!(value.length >=8 && value.length <= 16)){
                callback(new Error('密码长度至少8位，不超过16位'));
            }else{
                callback();
            }
        };
        const validatePhoneNum = (rule, value, callback) => {
            if(value === ''){
                callback(new Error('请输入您的手机号码'));
            }else if(!/^1\d{10}$/.test(value)){
                 callback(new Error('请输入正确的手机号码'));
            }else{
                callback();
            }
        };
        const validateCode = (rule, value, callback) => {
            if(value === ''){
                callback(new Error('验证码不能为空'));
            }else{
                callback();
            }
        };
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            }else if(!(value.length >=8 && value.length <= 16)){
                callback(new Error('密码长度至少8位，不超过16位'));
            } else {
                if (this.formSignup.repeatPassword !== '') {
                    this.$refs.formSignup.validateField('repeatPassword');
                }
                callback();
            }
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请重新出入一次密码'));
            }else if(!(value.length >=8 && value.length <= 16)){
                callback(new Error('密码长度至少8位，不超过16位'));
            } else if (value !== this.formSignup.password) {
                callback(new Error('两次密码不一致！'));
            } else {
                callback();
            }
        };
        return {
            login: false,
            avatar: '',
            loginModal: false,
            signupModal: false,
            msmLoginModal: false,
            qiniuModal: false,
            formLogin: {
                phoneNum: '',
                password: ''
            },
            ruleLogin: {
                phoneNum: [
                    {validator: validatePhoneNum}
                ],
                password: [
                    {validator: validateLoginPass}
                ]
            },
            msmForm: {
                phoneNum: '',
                msmCode: ''
            },
            formSignup: {
                phoneNum: '',
                checkCode: '',
                password: '',
                repeatPassword: ''
            },
            ruleSignup:{
                phoneNum: [
                    {validator: validatePhoneNum}
                ],
                checkCode: [
                    {validator: validateCode}
                ],
                password: [
                    {validator: validatePass}
                ],
                repeatPassword: [
                    {validator: validatePassCheck}
                ]
            },
            btnTitle: '获取验证码',
            disabled: false,
            qiniuInfo: {
                accessKey: '',
                secretKey: '',
                bucket: '',
                zone: 'z2',
                url: ''
            },
            rulesQiniu: {
                url: [{ required: true, type:'url', message: '绑定域名不符合规范'}]
            },
            albumsInfo: []
        }
    },
    methods: {
        getData(){
            this.$axios.get('/api/album')
                .then(res => {
                    this.albumsInfo = res.data;
                })
                .catch(error => {
                    console.log(error);
                });
            this.$axios.get(`/api/qiniu/config?phone=${this.$store.state.user.phone}`)
                .then(res => {
                    this.qiniuInfo.accessKey = res.data.accessKey;
                    this.qiniuInfo.secretKey = res.data.secretKey;
                    this.qiniuInfo.bucket = res.data.bucketName;
                    this.qiniuInfo.zone = res.data.zone;
                    this.qiniuInfo.url = res.data.bindURL;
                })
                .catch(error => {
                    console.log(error);
                })
        },
        handleLogin(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    const loginData = {
                        phone: this.formLogin.phoneNum,
                        password: this.formLogin.password
                    }
                    this.$axios.post('/api/users/login',loginData)
                        .then(res =>{
                            this.$Message.success('登录成功!♪(^∇^*)');
                            console.log(res);
                            const { token } = res.data;
                            localStorage.setItem("geekToken", token);
                            const decode = jwt_decode(token);
                            this.$store.commit("setLogin", true);
                            this.$store.commit("userInfo", decode);
                            this.loginModal = false;
                            this.login = true;
                            this.$router.push("/");
                        })
                        .catch(error => {
                            console.log(error);
                        })
                } else {
                    this.$Message.error('Fail!');
                }
            });
        },
        msmLogin(){
            this.loginModal = false;
            this.msmLoginModal = true;
        },
        handleSignup(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    const postData = {
                        phone: this.formSignup.phoneNum,
                        code: this.formSignup.checkCode,
                        password: this.formSignup.password,
                        repeatPassword: this.formSignup.repeatPassword
                    }
                    this.$axios.post('/api/users/register',postData)
                        .then(() => {
                            this.$Notice.success({
                                title: '注册成功！φ(≧ω≦*)♪',
                                desc: '请前往登录页面~~~~'
                            });
                            this.signupModal = false;
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    this.$Message.error('输入错误，请重新尝试!');
                }
            })
        },
        handleMsmSignin(){
            if(this.msmForm.msmCode === ''){
                this.$Message.warning('验证码不能为空！');
                return ;
            }
            if(this.validatePhone(this.msmForm.phoneNum)){
                const postData = {
                    phone: this.msmForm.phoneNum,
                    code: this.msmForm.msmCode
                }
                this.$axios.post('/api/users/codelogin', postData)
                    .then(res =>{
                        this.$Message.success('登录成功!♪(^∇^*)');
                        console.log(res);
                        const { token } = res.data;
                        localStorage.setItem("geekToken", token);
                        const decode = jwt_decode(token);
                        this.$store.commit("setLogin", true);
                        this.$store.commit("userInfo", decode);
                        this.msmLoginModal = false;
                        this.login = true;
                        this.$router.push("/");
                    }, res => {
                        console.log(res);
                        this.$Message.warning('登录失败！');
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }else{
                return ;
            }
        },
        getVerifyCode(phoneNum) {
        if (this.validatePhone(phoneNum)) {
            this.validateBtn();
            // 发送网络请求
            this.$axios.post("/api/users/code", {
                phone: phoneNum
            })
            .then(() => {
                this.$Message.success('短信已经发送，请注意查收！');
            }, () => {
                this.$Message.warning('短信失败！');
            })
            .catch(error => {
                console.log(error);
            })
        }
        },
        validateBtn() {
            let time = 60;
            let timer = setInterval(() => {
                if (time == 0) {
                clearInterval(timer);
                this.btnTitle = "获取验证码";
                this.disabled = false;
                } else {
                // 倒计时
                this.btnTitle = time + "秒后重试";
                this.disabled = true;
                time--;
                }
            }, 1000);
        },
        validatePhone(phoneNum) {
            //验证手机号码
            if (!phoneNum) {
                this.$Message.error('手机号不能为空！');
                return false;
            } else if (!/^1\d{10}$/.test(phoneNum)) {
                this.$Message.warning('请填写正确的手机号码！');
                return false;
            }
            return true;
        },
        handleToUp(){
            this.$router.push('/');
        },
        handleToAlbum(){
            this.$router.push('/album');
        },
        handleToAdmin(){
            this.$router.push('/admin');
        },
        handleSelectItem(name){
            if(name === 'logout'){
                console.log('work!');
                this.$Message.success('下次再来哦!♪(^∇^*)');
                localStorage.removeItem("geekToken");
                this.$store.commit("setLogin", false);
                this.login = false;
                this.$router.push("/");     
            }
            if(name == 'admin'){
                this.handleToAdmin();
            }
        },
        submitMotify(){
            const postData = {
                accessKey: this.qiniuInfo.accessKey,
                secretKey: this.qiniuInfo.secretKey,
                bucketName: this.qiniuInfo.bucket,
                zone: this.qiniuInfo.zone,
                bindURL: this.qiniuInfo.url,
                phone: this.$store.state.user.phone
            }
            this.$axios.post('/api/qiniu/config', postData)
                .then(res => {
                    console.log(res);
                    this.$Message.success('配置信息保存成功！');
                    this.qiniuModal = false;
                })
                .catch(error => {
                    console.log(error);
                })
        },
        selectAlbum(path){
            console.log(path);
            this.$router.push({ path: '/album' });
        }
    },
    created(){
        this.login = this.$store.state.isLogin;
        this.avatar = this.$store.state.user.avatar;
        this.getData();
    }
}
</script>


<style lang="less">
    .header{
        width: 100%;
        height: 68px;
        background-color: white;
        border-bottom: 1px solid #D3D3D3;
        display: flex;
        justify-content: space-between; 
    }
    .header-left{
        width: 500px;
        height: 100%;
        display: inline-flex;
        justify-content: space-evenly;
        align-content: center;
        align-items: center;
        .logo{
            font-size: 32px;
            font-weight: 600px;
            color: black;
            cursor: pointer;
        }
        .nav-word{
            font-size: 18px;
            cursor: pointer;
        }
    }
    .header-right{
        width: 200px;
        height: 100%;
        display: inline-flex;
        justify-content: space-evenly;
        align-content: center;
        align-items: center;
        font-size: 16px;
        div{
            cursor: pointer;
        }
    }
    .logout{
        width: 36px;
        height: 36px;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    .signin, .signup{
        &:hover{
            color: red;
        }
    }
    .sprit{
        font-size: 18px;
    }
    .login-box{
        input{
            height:42px;
        }
    }
    .ivu-form-item-content{
        .login-btn{
            height:42px;
            width: 100%;
            font-size: 18px;
        }
    }
    .to-signup{
        width: 100%;
        height: 42px;
        display: inline-flex;
        justify-content: space-between;
        margin-bottom: 0px;
        font-size: 14px;
        color: #808080;
    }
    .login-method{
        font-size: 16px;
        color: #808080;
    }
    .loginimgs{
      display: flex;
      justify-content: space-around;
      div{
        display: flex;
        height: 45px;
        width: 45px;
        border-radius: 50%;
        background-color: #f4f8fb;
        img{
          display: block;
          width: 23px;
          height: 23px;
          border-radius: 50%;
          margin: auto;
        }
      }
    }
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
            .ivu-modal-footer{
                display: flex;
                justify-content: center;
                .qiniu-modal-btn{
                    width: 150px;
                    height: 40px;
                    font-size: 14px;
                }
            }
        }
    }
    .qiniu-form{
        .ivu-form-item{
            .ivu-form-item-label{
                font-size: 16px;
                font-weight: 600;
            }
            .ivu-form-item-content{
                .ivu-radio-group{
                    .ivu-radio-wrapper{
                        font-size: 15px;
                        color: #FF8C00;
                    }
                }
            }
        }
    }
    .msm-btn{
        height: 42px;
    }
</style>
