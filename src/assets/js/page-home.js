/*
 * For home page js
 * */

(function($){
    var controller = function(){
        //获取openid
        this.openid = Common.getParameterByName('openid');
        this.baseUrl = 'http://wx-valrhona.e0x233.com';
    };

    //初始化页面
    controller.prototype.init = function(){
        var self = this;
        //显示
        $('.wrapper').addClass('fade');
        //获取用户图像
        self.getUserImage();
        self.bindEvent();
        //使用路由
        Common.hashRoute();
    };

    //获取用户图像
    controller.prototype.getUserImage = function(){
        var self = this;
        //Common.msgBox.add('图像获取中...');
        $.getJSON(self.baseUrl + '/v2/wx/users/no_cache/'+self.openid+'?access_token=zcBpBLWyAFy6xs3e5HeMPL9zWrd7Xy', function(result){
            console.log(result);
            $('.beauty').html('<img src="'+result.headimgurl+'">');
            Common.msgBox.remove();
        });
    };

    //绑定页面的事件
    controller.prototype.bindEvent = function(){
        var self = this;

        //添加hashchange,当hash变更的时候
        window.addEventListener("hashchange", function(){
            var hasTag = location.hash;
            var hashArr = hasTag.split('=');
            Common.gotoPin(hashArr[1]);
        }, false);


    //    选择当前用户角色
        $('#pin-landing .btn').on('click', function(){
            if($(this).attr('type') == "business"){
                //企业用户
                Common.gotoPin(1);
            }else{
                //烘培爱好者
                Common.gotoPin(2);
            }
        });

    //    当触碰input-box，error消失
        $('input').on('touchstart', function(){
            Common.errorMsg.remove($(this).parent());
        });
        $('select').on('touchstart', function(){
            Common.errorMsg.remove($(this).parent());
        });
        $('.input-box').on('touchstart', '.error', function(){
            Common.errorMsg.remove($(this).parent());
        });


    //    获取短信验证码
        var enabled = true;
        var btnGetCode = $('.btn-getcode');
        btnGetCode.on('touchstart', function(e){
            var element = $(this);
            if(self.validateMobile(e)){
            //    验证通过，调用发短信接口
            //    移除错误提示
                element.parent().find('.input-mobile').removeClass('error-box').siblings('.error').remove();
                if(!enabled) return;
                enabled = false;
                //console.log('验证通过，调用发短信接口');
                Common.msgBox.add('短信发送中...');
                $.ajax({
                    url:self.baseUrl + '/api/valrhona/register/code',
                    type:'POST',
                    dataType:'json',
                    data:{
                        openid: self.openid,
                        phone: $(this).parent().find('.input-mobile').val()
                    },
                    success:function(){
                        Common.msgBox.remove();
                        var count = 60;
                        element.addClass('disabled');
                        var countDown = setInterval(function(){
                            element.html(count+'s后可重发');
                            if(count == 0){
                                enabled = true;
                                element.removeClass('disabled').html('获取验证码');
                                clearInterval(countDown);
                            }
                            count--;
                        },1000);
                    }
                });
            }
        });

    //    选择单位
    //    以第一个值为默认值
    //    $('.input-your-company').val($('.select-your-company').val());
        $('.select-box select').on('change', function(){
            var curVal = $(this).val();
            if(curVal=="其他" || curVal=="请填写"){
                $(this).parent().addClass('changetoinput');
                //$(this).siblings('.input-select').val('');
            }else{
                $(this).parent().removeClass('changetoinput');
            }
            $(this).siblings('.input-select').val(curVal);
        });

    //    提交表单
        $('.input-submit').on('touchstart', function(e){
            e.preventDefault();
            if($(this).attr('type') == "business"){
            //    企业用户
                self.submitFormEnterprise();
            }else{
            //    烘培爱好者
                self.submitFormRoaster();
            }

        });

    };

    //验证手机号是否正确
    controller.prototype.validateMobile = function(event){
        var self = this;
        var validate = true,
            inputMobile = $(event.target).parent().find('.input-mobile');
            //inputMobile = $('.input-mobile');
        if(!inputMobile.val()){
            Common.errorMsg.add(inputMobile.parent(),'手机号码不能为空');
            validate = false;
        }else{
            var reg=/^1\d{10}$/;
            if(!(reg.test(inputMobile.val()))){
                validate = false;
                Common.errorMsg.add(inputMobile.parent(),'请输入正确的手机号');
            }else{
                Common.errorMsg.remove(inputMobile.parent());
            };
        };

        return validate;
    };

    //验证表单==>企业用户的表单
    controller.prototype.validateFormEnterprise = function(){
        var self = this;
        var validate = true,
            inputLastName = $('#form-register-enterprise .input-lastname'),
            inputFirstName = $('#form-register-enterprise .input-firstname'),
            inputMobile = $('#form-register-enterprise .input-mobile'),
            inputValidateCode = $('#form-register-enterprise .input-validate-code'),
            inputYourCompany = $('#form-register-enterprise .input-your-company'),
            inputWorkTitle = $('#form-register-enterprise .input-your-title'),
            inputConsumption = $('#form-register-enterprise .input-chocolate-consumption')
            ;

        if(!inputLastName.val()){
            Common.errorMsg.add(inputLastName.parent(),'请输入姓');
            validate = false;
        }else{
            Common.errorMsg.remove(inputLastName.parent());
        };

        if(!inputFirstName.val()){
            Common.errorMsg.add(inputFirstName.parent(),'请输入名');
            validate = false;
        }else{
            Common.errorMsg.remove(inputFirstName.parent());
        };

        if(!inputMobile.val()){
            Common.errorMsg.add(inputMobile.parent(),'手机号码不能为空');
            validate = false;
        }else{
            var reg=/^1\d{10}$/;
            if(!(reg.test(inputMobile.val()))){
                validate = false;
                Common.errorMsg.add(inputMobile.parent(),'请输入正确的手机号');
            }else{
                Common.errorMsg.remove(inputMobile.parent());
            }
        }

        if(!inputValidateCode.val()){
            Common.errorMsg.add(inputValidateCode.parent(),'验证码不能为空');
            validate = false;
        }else{
            Common.errorMsg.remove(inputValidateCode.parent());
        };

        if(!inputYourCompany.val()){
            Common.errorMsg.add(inputYourCompany.parent(),'请选择您的单位名称');
            validate = false;
        }else{
            if(inputYourCompany.val() == '请填写'){
                Common.errorMsg.add(inputYourCompany.parent(),'请填写您的单位名称');
                validate = false;
            }else{
                Common.errorMsg.remove(inputYourCompany.parent());
            }
        };

        if(!inputConsumption.val()){
            Common.errorMsg.add(inputConsumption.parent(),'请选择您的巧克力用量');
            validate = false;
        }else{
            if(inputConsumption.val() == '请填写'){
                Common.errorMsg.add(inputConsumption.parent(),'请填写您的巧克力用量');
                validate = false;
            }else{
                Common.errorMsg.remove(inputConsumption.parent());
            }
        };

        if(!inputWorkTitle.val()){
            Common.errorMsg.add(inputWorkTitle.parent(),'请选择您的职位');
            validate = false;
        }else{
            if(inputWorkTitle.val() == '请填写'){
                Common.errorMsg.add(inputWorkTitle.parent(),'请填写您的职位');
                validate = false;
            }else{
                Common.errorMsg.remove(inputWorkTitle.parent());
            }
        };

        if(validate){
            return true;
        }
        return false;
    };

    //提交企业用户的表单
    controller.prototype.submitFormEnterprise = function(){
        var self = this;
        if(self.validateFormEnterprise()){
            //    验证通过，提交表单，提交成功之后显示成功的样式
            //    验证通过，调用提交表单接口
            Common.msgBox.add('信息提交中...');
            var inputLastName = $('#form-register-enterprise .input-lastname'),
                inputFirstName = $('#form-register-enterprise .input-firstname'),
                inputMobile = $('#form-register-enterprise .input-mobile'),
                inputValidateCode = $('#form-register-enterprise .input-validate-code'),
                inputYourCompany = $('#form-register-enterprise .input-your-company'),
                inputWorkTitle = $('#form-register-enterprise .input-your-title'),
                inputConsumption = $('#form-register-enterprise .input-chocolate-consumption')
                ;
            $.ajax({
                url:self.baseUrl + '/api/valrhona/register/submit',
                type:'POST',
                dataType:'json',
                data:{
                    lastname: inputLastName.val(),
                    firstname: inputFirstName.val(),
                    openid: self.openid,
                    phone: inputMobile.val(),
                    code: inputValidateCode.val(),
                    work_unit: inputYourCompany.val(),
                    work_title:inputWorkTitle.val(),
                    consumption: inputConsumption.val(),
                    type: 'business'
                },
                success:function(data){
                    Common.msgBox.remove();
                    if(data.status==1){
                        Common.gotoPin(3);
                    }else{
                        Common.alertBox.add(data.msg);
                    }

                }
            });
        }
    };

    //验证表单==>爱好者的表单
    controller.prototype.validateFormRoaster = function(){
        var self = this;
        var validate = true,
            inputLastName = $('#form-register-roaster .input-lastname'),
            inputFirstName = $('#form-register-roaster .input-firstname'),
            inputMobile = $('#form-register-roaster .input-mobile'),
            inputValidateCode = $('#form-register-roaster .input-validate-code'),
            inputConsumption = $('#form-register-roaster .input-chocolate-consumption')
            ;

        if(!inputLastName.val()){
            Common.errorMsg.add(inputLastName.parent(),'请输入姓');
            validate = false;
        }else{
            Common.errorMsg.remove(inputLastName.parent());
        };

        if(!inputFirstName.val()){
            Common.errorMsg.add(inputFirstName.parent(),'请输入名');
            validate = false;
        }else{
            Common.errorMsg.remove(inputFirstName.parent());
        };

        if(!inputMobile.val()){
            Common.errorMsg.add(inputMobile.parent(),'手机号码不能为空');
            validate = false;
        }else{
            var reg=/^1\d{10}$/;
            if(!(reg.test(inputMobile.val()))){
                validate = false;
                Common.errorMsg.add(inputMobile.parent(),'请输入正确的手机号');
            }else{
                Common.errorMsg.remove(inputMobile.parent());
            }
        }

        if(!inputValidateCode.val()){
            Common.errorMsg.add(inputValidateCode.parent(),'验证码不能为空');
            validate = false;
        }else{
            Common.errorMsg.remove(inputValidateCode.parent());
        };


        if(!inputConsumption.val()){
            Common.errorMsg.add(inputConsumption.parent(),'请选择您的巧克力用量');
            validate = false;
        }else{
            if(inputConsumption.val() == '请填写'){
                Common.errorMsg.add(inputConsumption.parent(),'请填写您的巧克力用量');
                validate = false;
            }else{
                Common.errorMsg.remove(inputConsumption.parent());
            }
        };

        if(validate){
            return true;
        }
        return false;
    };

    //提交好者的表单
    controller.prototype.submitFormRoaster = function(){
        var self = this;
        if(self.validateFormRoaster()){
            //    验证通过，提交表单，提交成功之后显示成功的样式
            //    验证通过，调用提交表单接口
            Common.msgBox.add('信息提交中...');
            var inputLastName = $('#form-register-roaster .input-lastname'),
                inputFirstName = $('#form-register-roaster .input-firstname'),
                inputMobile = $('#form-register-roaster .input-mobile'),
                inputValidateCode = $('#form-register-roaster .input-validate-code'),
                inputConsumption = $('#form-register-roaster .input-chocolate-consumption')
                ;
            $.ajax({
                url:self.baseUrl + '/api/valrhona/register/submit',
                type:'POST',
                dataType:'json',
                data:{
                    lastname: inputLastName.val(),
                    firstname: inputFirstName.val(),
                    openid: self.openid,
                    phone: inputMobile.val(),
                    code: inputValidateCode.val(),
                    consumption: inputConsumption.val(),
                    type: 'person'
                },
                success:function(data){
                    Common.msgBox.remove();
                    if(data.status==1){
                        Common.gotoPin(3);
                    }else{
                        Common.alertBox.add(data.msg);
                    }

                }
            });
        }
    };


    this.controller = controller;
})(Zepto);


$(document).ready(function(){
    //如果openid不存在，直接跳转授权
    if(!Common.getParameterByName('openid')){
        location.href = 'http://wx-valrhona.e0x233.com/api/wechat/oauth/auth/58db4ee1-98ad-4c50-b140-aecd49ca71a8';
        return;
    }
    var mycontroller = new controller();
    mycontroller.init();
});