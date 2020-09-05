$(document).ready(function () {
    $.getJSON("/api/subjects")
      .then(showsubjects)
      .catch(function (err) {
        console.log(err);
      });
    function showsubjects(subject) {
      subject.forEach((element) => {
          console.log(element);
        //   var newsubject= $('<a class="item " href="http://localhost:4000/">' + element.name + '</a>');
          var newsubject= $(`<a href="https://shielded-reef-34948.herokuapp.com/${element._id}">${element.name}</a>`);
      $('body').append(newsubject);
      });
    }
  });
  