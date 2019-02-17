console.clear()
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var playerSize = 600
var aspect = 640/360
let videoID = 'cXgA1d_E-jY'
let filename;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: playerSize,
		width: playerSize * aspect,
		videoId: videoID,
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	event.target.seekTo(0)
	event.target.playVideo();
}

function onPlayerStateChange(event) {
	
}

function stopVideo() {
	player.stopVideo();
}


let prevtime = 0;
function getYTTime() {
	return player.getCurrentTime().toFixed(2)
}

let d = { 	"youtubeID":videoID,
			"formatArray":[] }

var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
// editor.session.setMode("ace/mode/javascript");
editor.setOptions({
    enableBasicAutocompletion: false
});
// change
var recordPos = false

editor.getSession().on('change', function(e) {
	if(recordPos) {
		opCursor()
		recordPos = false
	}
	console.log(e)
	if (e.action === 'insert') {
		if (e.lines.length > 1 || e.lines[0].length > 1){
			opBlock(e.lines)
			recordPos = true
		} else {
			opCharacter(e.lines[0])
		}
	} else if (e.action === 'remove') {
		opBackspace()
	}
	//console.log(d)
});
// down
editor.commands.addCommand({
    name: "down-arrow",
    exec: function(editor, args) {
		editor.navigateDown(args.times);
		opCursor()
	},
    bindKey: {mac: "Down", win: "Down"}
})
// up
editor.commands.addCommand({
    name: "up-arrow",
    exec: function(editor, args) {
		editor.navigateUp(args.times);
		opCursor()
	},
    bindKey: {mac: "Up", win: "Up"}
})
// left
editor.commands.addCommand({
    name: "left-arrow",
    exec: function(editor, args) {
		editor.navigateLeft(args.times);
		opCursor()
	},
    bindKey: {mac: "Left", win: "Left"}
})
// right
editor.commands.addCommand({
    name: "right-arrow",
    exec: function(editor, args) {
		editor.navigateRight(args.times); 
		opCursor()
	},
    bindKey: {mac: "Right", win: "Right"}
})

$('#editor').click(function() {
	opCursor()
})

$('#add-file').click(() => {
	$("#modal").show()
})

$('#submit').click(function() {
	opAddFile($("#file-name-input").val())
	$("#modal").hide()
})

function opCharacter(ch) {
	d.formatArray.push({
		"op": "ch",
		"ts": getYTTime(),
		"ch": ch
	})
}

function opBlock(lines) {
	let blockStr = ""
	lines.forEach((line, i) => {
		blockStr += line
		if (i !== lines.length-1) {
			blockStr += '\n'
		}
	})
	d.formatArray.push({
		"op": "block",
		"ts": getYTTime(),
		"block": blockStr
	})
}

function opCursor() {
	let pos = editor.getCursorPosition()
	console.log(filename)
	d.formatArray.push({
		"op": "cur",
		"ts": getYTTime(),
		"pos": [pos.row, pos.column],
		"file": filename
	})
	console.log(JSON.stringify(d.formatArray))
}

function opBackspace() {
	d.formatArray.push({
		"op": "bck",
		"ts": getYTTime(),
	})
}


function opAddFile(name) {
	d.formatArray.push({
		"op": "adf",
		"ts": getYTTime(),
		"file": name
	})
	filename=name
}

$("#save-file").click(() => {
	save(filename + ".json", JSON.stringify(d))
})

function save(filename, data) {
    var blob = new Blob([data], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}

