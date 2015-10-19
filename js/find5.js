/* Cool Javascript Find on this Page 
Ver 5.3
Written by Jeff Baker on September, 8, 2007.
Copyright 2014 by Jeff Baker - 
Version 5.0 created 7/16/2014
Updated 5/15/2015 ver 5.3
http://www.seabreezecomputers.com/tips/find.htm
Paste the following javascript call in your HTML web page where
you want a button called "Find on this Page...":

<script type="text/javascript" language="JavaScript" 
src="find5.js">
</script>

When you click on the button a floating DIV will pop up
that will have a text box for users to enter in the text they
want to find on the page.  

WARNING: If you want to place a second "Find on this page..."
button somewhere on the same page then use the code below for
the second button, otherwise firefox and netscape will not
display the text that users type in and it will not find
text correctly because there will be two different text input
boxes with the same name:

<input type="button" value="Find on this page..." 
onclick="show();">
	
*/

/**** Compressed****/
var find_window_background="white";var find_window_border="#29DCB2";var find_text_color="#29DCB2";var find_title_color="white";var find_window_width=245;var find_window_height=85;var find_root_node=null;var drag={mousex:0,mousey:0,tempx:'',tempy:'',isdrag:false,drag_obj:null,drag_obj_x:0,drag_obj_y:0};var find_timer=0;var highlights=[];var find_pointer=-1;var find_text='';var found_highlight_rule=0;var found_selected_rule=0;document.onmousedown=MouseDown;document.onmousemove=MouseMove;document.onmouseup=MouseUp;document.ontouchstart=MouseDown;document.ontouchmove=MouseMove;document.ontouchend=MouseUp;function highlight(word,node)
{if(!node)
node=document.body;var re=new RegExp(word,"i");for(node=node.firstChild;node;node=node.nextSibling)
{if(node.nodeType==3)
{var n=node;var match_pos=0;{match_pos=n.nodeValue.search(re);if(match_pos>-1)
{var before=n.nodeValue.substr(0,match_pos);var middle=n.nodeValue.substr(match_pos,word.length);var after=document.createTextNode(n.nodeValue.substr(match_pos+word.length));var highlight_span=document.createElement("span");if(found_highlight_rule==1)
highlight_span.className="highlight";else
highlight_span.style.backgroundColor="yellow";highlight_span.appendChild(document.createTextNode(middle));n.nodeValue=before;n.parentNode.insertBefore(after,n.nextSibling);n.parentNode.insertBefore(highlight_span,n.nextSibling);highlights.push(highlight_span);highlight_span.id="highlight_span"+highlights.length;node=node.nextSibling;}}}
else
{if(node.nodeType==1&&node.nodeName.match(/textarea/i)&&!getStyle(node,"display").match(/none/i))
textarea2pre(node);else
{if(node.nodeType==1&&!getStyle(node,"visibility").match(/hidden/i))
if(node.nodeType==1&&!getStyle(node,"display").match(/none/i))
highlight(word,node);}}}}
function unhighlight()
{for(var i=0;i<highlights.length;i++)
{var the_text_node=highlights[i].firstChild;var parent_node=highlights[i].parentNode;if(highlights[i].parentNode)
{highlights[i].parentNode.replaceChild(the_text_node,highlights[i]);if(i==find_pointer)selectElementContents(the_text_node);parent_node.normalize();normalize(parent_node);}}
highlights=[];find_pointer=-1;}
function normalize(node){if(!node){return;}
if(node.nodeType==3){while(node.nextSibling&&node.nextSibling.nodeType==3){node.nodeValue+=node.nextSibling.nodeValue;node.parentNode.removeChild(node.nextSibling);}}else{normalize(node.firstChild);}
normalize(node.nextSibling);}
function findit()
{var string=document.getElementById('fwtext').value;findwindow.style.visibility='hidden';if(find_text.toLowerCase()==document.getElementById('fwtext').value.toLowerCase()&&find_pointer>=0)
{findnext();}
else
{unhighlight();if(string=='')
{find_msg.innerHTML="";findwindow.style.visibility='visible';return;}
find_text=string;if(find_root_node!=null)
var node=document.getElementById(find_root_node);else
var node=null;highlight(string,node);if(highlights.length>0)
{find_pointer=-1;findnext();}
else
{find_msg.innerHTML="&nbsp;<b>0 of 0</b>";find_pointer=-1;}}
findwindow.style.visibility='visible';}
function findnext()
{var current_find;if(find_pointer!=-1)
{current_find=highlights[find_pointer];if(found_highlight_rule==1)
current_find.className="highlight";else
current_find.style.backgroundColor="yellow";}
find_pointer++;if(find_pointer>=highlights.length)
find_pointer=0;var display_find=find_pointer+1;find_msg.innerHTML=display_find+" of "+highlights.length;current_find=highlights[find_pointer];if(found_selected_rule==1)
current_find.className="find_selected";else
current_find.style.backgroundColor="orange";scrollToPosition(highlights[find_pointer]);}
function findprev()
{var current_find;if(highlights.length<1)return;if(find_pointer!=-1)
{current_find=highlights[find_pointer];if(found_highlight_rule==1)
current_find.className="highlight";else
current_find.style.backgroundColor="yellow";}
find_pointer--;if(find_pointer<0)
find_pointer=highlights.length-1;var display_find=find_pointer+1;find_msg.innerHTML=display_find+" of "+highlights.length;current_find=highlights[find_pointer];if(found_selected_rule==1)
current_find.className="find_selected";else
current_find.style.backgroundColor="orange";scrollToPosition(highlights[find_pointer]);}
function checkkey(e)
{var keycode;if(window.event)
keycode=window.event.keyCode;else
keycode=e.which;if(keycode==13)
{if(window.event&&event.srcElement.id.match(/fwtext/i))event.srcElement.blur();else if(e&&e.target.id.match(/fwtext/i))e.target.blur();findit();}
else if(keycode==27)
{hide();}}
function show()
{var textbox=document.getElementById('fwtext');findwindow.style.visibility='visible';textbox.focus();textbox.select();textbox.setSelectionRange(0,9999);find_timer=setInterval('move_window();',500);document.onkeydown=checkkey;}
function hide()
{unhighlight();findwindow.style.visibility='hidden';clearTimeout(find_timer);document.onkeydown=null;}
function resettext()
{if(find_text.toLowerCase()!=document.getElementById('fwtext').value.toLowerCase())
unhighlight();}
function move_window()
{var fwtop=parseFloat(findwindow.style.top);var fwleft=parseFloat(findwindow.style.left);var fwheight=parseFloat(findwindow.style.height);if(document.documentElement.scrollTop)
var current_top=document.documentElement.scrollTop;else
var current_top=document.body.scrollTop;var current_bottom=(window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight)+current_top;if(document.documentElement.scrollLeft)
var current_left=document.documentElement.scrollLeft;else
var current_left=document.body.scrollLeft;var current_right=(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)+current_left;if(fwtop<current_top)
{findwindow.style.top=current_top+30+'px';}
else if(fwtop>current_bottom-fwheight)
{findwindow.style.top=current_bottom-fwheight+'px';}
if(fwleft<current_left||fwleft>current_right)
{findwindow.style.left=current_left+'px';}}
function MouseDown(event)
{drag.tempx=drag.tempy='';if(!event)event=window.event;var fobj=event.target||event.srcElement;var scrollLeft=document.body.scrollLeft||document.documentElement.scrollLeft;var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;if(typeof fobj.nodeName!="undefined")
if(fobj.nodeName.toLowerCase()=="input"||fobj.nodeName.toLowerCase()=="textarea")
return true;for(fobj;fobj;fobj=fobj.parentNode)
{if(fobj.className)
if(fobj.className.match(/dragme/i))
break;}
if(fobj)
if(fobj.className.match(/dragme/i))
{drag.isdrag=true;drag.drag_obj=fobj;drag.drag_obj_x=parseInt(drag.drag_obj.offsetLeft);drag.drag_obj_y=parseInt(drag.drag_obj.offsetTop);drag.mousex=event.clientX+scrollLeft;drag.mousey=event.clientY+scrollTop;if(event.type=="touchstart")
if(event.touches.length==1)
{var touch=event.touches[0];var node=touch.target;drag.mousex=touch.pageX;drag.mousey=touch.pageY;}
return true;}}
function MouseMove(event)
{if(drag.isdrag)
{if(!event)event=window.event;drag.tempx=event.clientX;drag.tempy=event.clientY;var scrollLeft=document.body.scrollLeft||document.documentElement.scrollLeft;var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;drag.tempx+=scrollLeft;drag.tempy+=scrollTop;drag.drag_obj.style.position='absolute';if(event.type=="touchmove")
if(event.touches.length==1)
{var touch=event.touches[0];var node=touch.target;drag.tempx=touch.pageX;drag.tempy=touch.pageY;}
drag.drag_obj.style.left=drag.drag_obj_x+drag.tempx-drag.mousex+"px";drag.drag_obj.style.top=drag.drag_obj_y+drag.tempy-drag.mousey+"px";return false;}}
function MouseUp()
{if(drag.isdrag==true)
{if(drag.tempx==''&&drag.tempy=='')
{}}
drag.isdrag=false;}
function scrollToPosition(field)
{var scrollLeft=document.body.scrollLeft||document.documentElement.scrollLeft;var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;var scrollBottom=(window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight)+scrollTop;var scrollRight=(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)+scrollLeft;if(field)
{var theElement=field;var elemPosX=theElement.offsetLeft;var elemPosY=theElement.offsetTop;theElement=theElement.offsetParent;while(theElement!=null)
{elemPosX+=theElement.offsetLeft
elemPosY+=theElement.offsetTop;theElement=theElement.offsetParent;}
if(elemPosX<scrollLeft||elemPosX>scrollRight||elemPosY<scrollTop||elemPosY>scrollBottom)
field.scrollIntoView();}}
function getStyle(el,styleProp)
{var x=(document.getElementById(el))?document.getElementById(el):el;if(x.currentStyle)
var y=x.currentStyle[styleProp];else if(window.getComputedStyle)
var y=document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);return y;}
function create_div(dleft,dtop,dwidth,dheight)
{if(document.documentElement.scrollTop)
var current_top=document.documentElement.scrollTop;else
var current_top=document.body.scrollTop;if(document.getElementById('findwindow'))
{findwindow=document.getElementById('findwindow');}
else
{findwindow.id="findwindow";findwindow.style.position='absolute';document.body.insertBefore(findwindow,document.body.firstChild);findwindow.className='findwindow dragme';findwindow.style.visibility='hidden';}
findwindow.style.backgroundColor=find_window_background;findwindow.style.border='2px solid '+find_window_border;findwindow.style.color=find_text_color;findwindow.style.width=find_window_width+'px';findwindow.style.height=+find_window_height+'px';findwindow.style.top='200px';findwindow.style.right='50px';findwindow.style.padding='0px';findwindow.style.zIndex=2000;findwindow.style.fontSize='14px';findwindow.style.overflowX='hidden';findwindow.innerHTML='<div style="text-align: center'+';width: '+(find_window_width-20)+'px'+';cursor: move'+';color: '+find_title_color+';border: 1px solid '+find_text_color+';background-color: '+find_window_border+';float: left'+';" onmouseover="over=1;" onmouseout="over=0;">'+'Search</div>';findwindow.innerHTML+='<div onclick="hide();" class="close" style="text-align: center'+';width: '+(16)+'px'+';cursor: pointer'+';font-weight: bold'+';background-color: white'+';border: 1px solid '+find_text_color+';float: right'+';">'+'X'+'</div><br />\n';findwindow.innerHTML+='<div id="window_body" style="padding: 5px;">'+'<form onsubmit="return false;"><input type="search" size="22" maxlength="25" id="fwtext"'+' onchange="resettext();" placeholder="Enter text to find">'+'<input class="search-button" type="button" value="Find Prev" onclick="findprev();">'+'<input class="search-button" id="btn" type="button" value="Find Next" onclick="this.blur(); findit();">'+' <span id="find_msg"><br /></span>'+'</form></div>\n';var sheets=document.styleSheets;for(var i=0;i<sheets.length;i++)
{var rules=(sheets[i].rules)?sheets[i].rules:sheets[i].cssRules;if(rules!=null)
for(var j=0;j<rules.length;j++)
{if(rules[j].selectorText=='.highlight')
found_highlight_rule=1;else if(rules[j].selectorText=='.find_selected')
found_selected_rule=1;}}}
function textarea2pre(el)
{if(el.nextSibling&&el.nextSibling.id&&el.nextSibling.id.match(/pre_/i))
var pre=el.nextsibling;else
var pre=document.createElement("pre");var the_text=el.value;the_text=the_text.replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');pre.innerHTML=the_text;var completeStyle="";if(el.currentStyle)
{var elStyle=el.currentStyle;for(var k in elStyle){completeStyle+=k+":"+elStyle[k]+";";}
pre.style.border="1px solid black";}
else
{completeStyle=window.getComputedStyle(el,null).cssText;pre.style.cssText=completeStyle;}
el.parentNode.insertBefore(pre,el.nextSibling);el.onblur=function(){this.style.display="none";pre.style.display="block";};el.onchange=function(){pre.innerHTML=el.value.replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');};el.style.display="none";pre.id="pre_"+highlights.length;pre.onclick=function(){this.style.display="none";el.style.display="block";el.focus();el.click()};}
function selectElementContents(el)
{if(window.getSelection&&document.createRange){var range=document.createRange();range.selectNodeContents(el);var sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);}else if(document.body.createTextRange){var textRange=document.body.createTextRange();textRange.moveToElementText(el);textRange.select();}}
document.write('<input id="search-show-btn" type="button" value="Search"'+' onclick="show();">');var findwindow=document.createElement("div");create_div();var find_msg=document.getElementById('find_msg');