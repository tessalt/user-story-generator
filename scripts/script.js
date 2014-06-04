(function(){

  var ui = {
    usButton: document.getElementById('submit'),
    nounInput: document.getElementById('noun'),
    actionInput: document.getElementById('action'),
    output: document.getElementById('userstory'),
    outputContainer: document.getElementById('output'),
    inputContainer: document.getElementById('input'),
    moreButton: document.getElementById('more')
  };

  function generateUserStory(e) {
    e.preventDefault();
    var noun = ui.nounInput.value || 'user';
    var action = ui.actionInput.value || 'order a widget';
    var userStory = 'As a ' + noun + ', I want to ' + action + ',<br/> so that I can ' + action + ',<br/> because I\'d like to ' + action;
    ui.output.innerHTML = userStory;
    ui.outputContainer.classList.add('fade-in');
    return false;
  }

  function resetResult () {
    ui.outputContainer.classList.add('slide-up');
  }

  function resetPage(e) {
    if (this.classList.contains('slide-up')) {
      ui.outputContainer.classList.remove('slide-up');
      ui.outputContainer.classList.remove('fade-in');
      ui.nounInput.focus();
      ui.actionInput.value = '';
    }
  }

  function clearFocus() {
    this.value = '';
  }

  ui.usButton.addEventListener('click', generateUserStory, false);

  ui.moreButton.addEventListener('click', resetResult, false);

  ui.outputContainer.addEventListener('transitionend', resetPage, false);

  ui.nounInput.addEventListener('focus', clearFocus, false);

  ui.actionInput.addEventListener('focus', clearFocus, false);

})();