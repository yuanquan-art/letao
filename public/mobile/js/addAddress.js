$(function(){
	// 省市区弹出框
	var cityPicker = new mui.PopPicker({layer:3});
    cityPicker.setData(cityData);
	var showCityPickerButton = document.getElementById('showCityPicker');
	showCityPickerButton.addEventListener('tap', function(event) {
		cityPicker.show(function(items) {
			$('[name="address"]').val((items[0] || {}).text + (items[1] || {}).text + (items[2] || {}).text);
		});
	}, false);
	// 默认为添加收货地址
	var flag = true;
	// 看地址栏中是否有ID参数 如果有就是修改地址 否则就是添加地址
	if(getParamsByUrl(location.href,'id')){
		// 修改收获地址
		flag = false;
		$.ajax({
			url:'/address/queryAddress',
			method:'get',
			success:function(result){
				for(var i=0;i<result.length;i++){
					if(result[i].id == getParamsByUrl(location.href,'id')){
						$('[name="address"]').val(result[i].address);
						$('[name="addressDetail"]').val(result[i].addressDetail);
						$('[name="recipients"]').val(result[i].recipients);
						$('[name="postcode"]').val(result[i].postCode);
					}
				}
			}
		});
	}
	// 添加收货地址
	$('#addAdress').on('tap',function(){
		var This = $(this);
		var url = '/address/addAddress';
		var data = {
			address:$.trim($('[name="address"]').val()),
			addressDetail:$.trim($('[name="addressDetail"]').val()),
			recipients:$.trim($('[name="recipients"]').val()),
			postcode:$.trim($('[name="postcode"]').val())
		}
		if(!data.address){
			alert('请选择地址');
			return;
		}
		if(!data.addressDetail){
			alert('请输入详细地址');
			return;
		}
		if(!data.recipients){
			alert('请输入收货人');
			return;
		}
		if(!data.postcode){
			alert('请输入邮政编码');
			return;
		}

		// 修改收货地址
		if(!flag){
			data.id = getParamsByUrl(location.href,'id');
			url = "/address/updateAddress";
		}
		$.ajax({
			url:url,
			type:'post',
			data:data,
			beforeSend:function(){
				This.html('正在'+ (flag ? '添加' : '修改') + '收货地址');
			},
			success:function(result){
				if(result.success){
					alert('修改地址成功')
					location.href = "address.html";
				}else{
					alert(result.message)
				}
			}
		});
	});
});