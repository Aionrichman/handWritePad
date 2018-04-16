$(document).ready(

    $('#predictImg').fileinput({
        language: 'zh',
        uploadUrl: "./result",
        allowedFileExtensions: ['jpg', 'gif', 'png'],
        uploadExtraData: {"csrfmiddlewaretoken": $("#csrf-form").serializeArray()[0]["value"]}
    }),

    $('#predictImg').on('fileuploaded', function(event, data, previewId, index) {
        var result = data.response;
        console.log(result);
        document.querySelector('#mnist-pad-result').innerHTML = result.number;

        var uploadBtn = $("#mnist-pad-upload");
        uploadBtn.attr("disabled", false);
        uploadBtn.unbind("click");
        uploadBtn.click(function (event) {uploadError(result.id);});
    })
);

function uploadError(id) {
    var form = document.getElementById("csrf-form");
    var formData = new FormData(form);

    formData.append("id", id);
    formData.append("error", 0);

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if ((request.status >= 200 && request.status < 300) || request.status === 304) {
                var uploadBtn = document.querySelector('#mnist-pad-upload');
                uploadBtn.disabled = true;
            }
        }
    };

    request.open("POST", "./uploadError");
    request.send(formData);
}