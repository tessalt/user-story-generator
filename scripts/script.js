(function(){

  var userStory;

  var ui = {
    usButton: document.getElementById('submit'),
    nounInput: document.getElementById('noun'),
    actionInput: document.getElementById('action'),
    output: document.getElementById('userstory'),
    outputContainer: document.getElementById('output'),
    inputContainer: document.getElementById('input'),
    moreButton: document.getElementById('more'),
    trelloButton: document.getElementById('trello-launch'),
    trelloContainer: document.getElementById('trello'),
    closeTrello: document.getElementById('close-trello'),
    back: document.getElementById('back'),
    tweet: document.getElementById('tweet-button')
  };

  var templates = {
    boards: document.getElementById('trello-boards'),
    lists: document.getElementById('trello-lists'),
    success: document.getElementById('card-success')
  }

  function generateUserStory(e) {
    e.preventDefault();
    var noun = ui.nounInput.value || 'user';
    var action = ui.actionInput.value || 'order a widget';
    userStory = 'As a ' + noun + ', I want to ' + action + ',<br/> so that I can ' + action + ',<br/> because I\'d like to ' + action;
    ui.output.innerHTML = userStory;
    ui.outputContainer.classList.add('fade-in');
    ui.inputContainer.classList.add('slide-down');
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

  function launchTrello(e) {
    e.preventDefault();
    ui.trelloContainer.classList.add('pull-down');
    Trello.authorize({
      type: 'popup',
      scope: {
        read: true,
        write: true,
        account: true
      },
      success: function() {
        getBoards();
      }
    });
  }

  function getBoards() {
    Trello.get("members/me/boards", { fields: "name" }, function(boards){
      [].forEach.call(boards, function(board) {
        renderBoard(board);
      });
    });
  }

  function renderBoard(board) {
    var li = document.createElement('li');
    li.innerHTML = board.name;
    li.setAttribute('id', board.id);
    li.addEventListener('click', selectBoard, false);
    templates.boards.appendChild(li);
  }

  function selectBoard(e) {
    templates.boards.classList.add('hidden');
    templates.lists.innerHTML = '';
    var id = e.target.getAttribute('id');
    getLists(id);
  }

  function getLists(id) {
    ui.back.classList.add('visible');
    templates.lists.classList.remove('hidden');
    Trello.get('boards/' + id + '/lists', function(lists){
      [].forEach.call(lists, function(list){
        renderList(list);
      });
    });
  }

  function renderList(list) {
    var li = document.createElement('li');
    li.innerHTML = list.name;
    li.setAttribute('id', list.id);
    li.addEventListener('click', selectList, false);
    templates.lists.appendChild(li);
  }

  function selectList(e) {
    var id = e.target.getAttribute('id');
    var name = userStory.replace(/(<([^>]+)>)/ig,"");
    Trello.post('lists/' + id + '/cards', {
      name: name
    }, function(card) {
      postSuccess(card);
    });
  }

  function postSuccess(card) {
    templates.boards.classList.add('hidden');
    templates.lists.classList.add('hidden');
    templates.success.classList.add('visible');
    var link = document.createElement('a');
    link.innerHTML = card.name;
    link.setAttribute('href', card.url);
    templates.success.appendChild(link);
  }

  function closeTrello () {
    ui.trelloContainer.classList.remove('pull-down');
    ui.outputContainer.classList.add('slide-up');
  }

  function goBack() {
    templates.lists.classList.add('hidden');
    templates.boards.classList.remove('hidden');
  }

  function tweet(e) {
    var url = e.target.getAttribute('href');
    var story = userStory.replace(/(<([^>]+)>)/ig,"");
    story = encodeURIComponent(story);
    e.target.setAttribute('href', url + story);
  }

  ui.usButton.addEventListener('click', generateUserStory, false);

  ui.moreButton.addEventListener('click', resetResult, false);

  ui.outputContainer.addEventListener('transitionend', resetPage, false);

  ui.nounInput.addEventListener('focus', clearFocus, false);

  ui.actionInput.addEventListener('focus', clearFocus, false);

  ui.trelloButton.addEventListener('click', launchTrello, false);

  ui.closeTrello.addEventListener('click', closeTrello, false);

  ui.back.addEventListener('click', goBack, false);

  ui.tweet.addEventListener('click', tweet, false);

})();