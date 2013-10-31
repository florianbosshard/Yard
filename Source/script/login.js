var login = {
	loginAction : function() {
		var name = $("#name").val();
		if (name.length == 0) {
			alert('Wir akzeptieren keine anonymen MisterX Jäger');
		} else {
			$.ajax({
				type : 'POST',
				contentType : "text/json",
				url : "/api/server.php/login/",
				dataType : "json",
				data : JSON.stringify({
					"name" : name
				}),
				success : function(data, textStatus, jqXHR) {
					console.log(data);
					
					window.location.href = "game.html";

				},
				error : function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		}

	}
};

$(document).ready(function() {

	$("#btnSend").click(login.loginAction);

});
