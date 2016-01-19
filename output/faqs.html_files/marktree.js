/* MarkTree JavaScript code
 * 
 * Distributed under the terms of the MIT License.
 * See "LICENCE.MIT" or http://www.opensource.org/licenses/mit-license.php for details.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 * 
 * Miika Nurminen, 12.7.2004.
 */

/* cross-browser (tested with ie5, mozilla 1 and opera 5) keypress detection */
function get_keycode(evt) {
  // IE
    code = document.layers ? evt.which
           : document.all ? event.keyCode // event.keyCode!=evt.keyCode!
           : evt.keyCode;

  if (code==0) 
    code=evt.which; // for NS
  return code;
}

var lastnode=null;
var listnodes = null;
var list_index=1;
var lastnodetype=''; // determines if node is a link, input or text;

// up, left, down, right, keypress codes
//ijkl
//var keys = new Array(105,106,107,108);
//num arrows
//var keys = new Array(56,52,50,54);
//wasd
// var press2 = new Array(119,97,115,100);
 var press = new Array(47,45,42,43);

// keydown codes
  //  var keys2=new Array(87,65,83,68);
  var keys= new Array(38,37,40,39);

  // keyset 1 = keydown, otherwise press
function checkup(keyset,n) {
  if (keyset==1) return (n==keys[0]);
  return ((n==press[0]) /*|| (n==press2[0])*/)
}

function checkdn(keyset,n) {
  if (keyset==1) return (n==keys[2]);
  return ((n==press[2]) /*|| (n==press2[2])*/)
}

function checkl(keyset,n) {
  if (keyset==1) return (n==keys[1]);
  return ((n==press[1]) /*|| (n==press2[1])*/)
}

function checkr(keyset,n) {
  if (keyset==1) return (n==keys[3]);
  return ((n==press[3]) /*|| (n==press2[3])*/)
}





function is_exp(n) {
  if (n==null) return false;
  return ((n.className=='exp') || (n.className=='exp_active'));
}

function is_col(n) {
  if (n==null) return false;
  return ((n.className=='col') || (n.className=='col_active'));
}

function is_basic(n) {
  if (n==null) return false;
  return ((n.className=='basic') || (n.className=='basic_active'));
}



/* returns i>=0 if true */
function is_active(node) {
  if (node.className==null) return false
  return node.className.indexOf('_active');
}

function toggle_class(node) {
  if ((node==null) || (node.className==null)) return;
  str=node.className;
  result="";
  i = str.indexOf('_active');
  if (i>0)
    result= str.substr(0,i);
  else
    result= str+"_active";
  node.className=result; 
  return node;
}

function activate(node) {
  node.style.backgroundColor='#eeeeff';
}

function deactivate(node) {
   node.style.backgroundColor='#ffffff';
}

function is_list_node(n) {
  if (n==null) return false;
  if (n.className==null) return false;
  if ( (is_exp(n)) || 
       (is_col(n)) ||
       (is_basic(n)) )
   return true; else return false;
}


function get_href(n) {
  alist=n.attributes;
  if (alist!=null) {
    hr = alist.getNamedItem('href');
    if (hr!=null) return hr.nodeValue;
  }
  if (n.childNodes.length==0) return '';
  for (var i=0; i<n.childNodes.length; i++) {
    s = get_href(n.childNodes[i]);
    if (s!='') return s;
  }
  return '';
}

function get_link(n) {
  if (n==null) return null;
  if (n.style==null) return null;

 // disabling uncontrolled recursion to prevent error messages on IE
 // when trying to focus to invisible links (readonly mode)
//    alert(n.nodeName+' '+n.className);
  if ((n.nodeName=='UL') && (n.className=='sub')) return null;

  if (n.nodeName=='A') return n;
  if (n.childNodes.length==0) return null;
  for (var i=0; i<n.childNodes.length; i++) {
    s = get_link(n.childNodes[i]);
    if (s!=null) return s;
  }
  return null;
}

function set_lastnode(n) {
/*var d = new Date();
var t_mil = d.getMilliseconds();*/
// testattu nopeuksia explorerilla, ei merkittäviä eroja
  if (lastnode==n) return; 
/*  deactivate(lastnode)
  lastnode=n;
  activate(lastnode);*/

  if (is_active(lastnode)>=0)
    toggle_class(lastnode);
  lastnode=n;
  if (!(is_active(lastnode)>=0))
    toggle_class(lastnode);


/*var d2 = new Date();
var t_mil2 = d2.getMilliseconds();
  window.alert(t_mil2-t_mil);*/
}

function next_list_node() {
  tempIndex = list_index;
  while (tempIndex<listnodes.length-1) {
    tempIndex++;
    var x = listnodes[tempIndex];
    if (is_list_node(x)) {
      list_index=tempIndex;
      return;
    }
  }
}

function prev_list_node() {
  tempIndex = list_index;
  while (tempIndex>0) {
    tempIndex--;
    var x = listnodes[tempIndex];
    if (is_list_node(x)) {
      list_index=tempIndex;
      return;
    }
  }
}



function getsub (li) {
  if (li.childNodes.length==0) return null;
  for (var c = 0; c < li.childNodes.length; c++)
    if ( (li.childNodes[c].className == 'sub') || (li.childNodes[c].className == 'subexp') ) 
      return li.childNodes[c];
}

function find_listnode_recursive (li) {
  if (is_list_node(li)) return li; 
  if (li.childNodes.length==0) return null;
  result=null;
  for (var c = 0; c < li.childNodes.length; c++) {
    result=find_listnode_recursive(li.childNodes[c]);
    if (result!=null) return result;
  }
  return null;
}

function next_child_listnode(li) {
  var result=null;
  for (var i=0; i<li.childNodes.length; i++) {
    result=find_listnode_recursive(li.childNodes[i]);
    if (result!=null) return result;
  }
  return null;  
}

function next_actual_sibling_listnode(li) {
  if (li==null) return null;
  var temp=li;
  while (1) { 
    var n = temp.nextSibling;
    if (n==null) {
      n=parent_listnode(temp);
      return next_actual_sibling_listnode(n);
    }
    if (is_list_node(n)) return n;
    temp=n;
  }
}

function next_sibling_listnode(li) {
if (li==null) return null; 
 var result=null;
  var temp=li;
  if (is_col(temp)) return next_child_listnode(temp);
  while (1) { 
    var n = temp.nextSibling;
    if (n==null) {
      n=parent_listnode(temp);
      return next_actual_sibling_listnode(n);
    }
    if (is_list_node(n)) return n;
    temp=n;
  }
}

function last_sibling_listnode(li) {
  if (li==null) return null;
  var temp=li;
  var last=null;
  while(1) {
    var n = temp.nextSibling;
    if (is_list_node(temp)) 
      last = temp;
    if (n==null) {
      if (is_col(last)) return last_sibling_listnode(next_child_listnode(last));
      else return last;
    }
    temp = n;
  }
}

function prev_sibling_listnode(li) { 
  if (li==null) return null;
  var temp=li;
  var n = null;
  while (1) { 
    n = temp.previousSibling;
    if (n==null) {
      return parent_listnode(li);
    }
    if (is_list_node(n)) {
      if (is_col(n)) { 
        return last_sibling_listnode(next_child_listnode(n));
      }
      else {
        return n;
      }
    }
    temp=n;
  }
}


function parent_listnode(li) {
  // added 12.7.2004 to prevent IE error when readonly mode==true
  if (li==null) return null;
  n=li;
  while (1) {
    n=n.parentNode;
    if (n==null) return null;
    if (is_list_node(n)) return n;
  }
}

function getVisibleParents(id) {
  var n = document.getElementById(id);
  while(1) {
    expand(n);
    n = parent_listnode(n);
    if (n==null) return;
  }
}

function _findLinkOfNode(aNode) {
    var resultLink = "";
    
    if (aNode.parentNode == null) {
        return resultLink;
    }
    
    
    for (var i = 0; i<aNode.parentNode.childNodes.length;i++) {
        var theNodes = aNode.parentNode.getElementsByTagName('A');
        var theNode;
        if (theNodes.length > 0) {
            theNode = theNodes[0];
            if (theNode.nodeName == 'A' || theNode.nodeName == 'a') {
                resultLink = theNode.getAttribute("href");
                if (resultLink.length > 0) {
                    break;
                }
            }
        }
    }
    
    if (resultLink.length > 0) {
        return resultLink;
    } else {
        return _findLinkOfNode(aNode.parentNode);
    }
}

function onClickHandler (evt) {
if (lastnode==null) 
{
listnodes = document.getElementsByTagName('li');
lastnode=listnodes[1];
temp=listnodes[1];
}


  var target = evt ? evt.target : event.srcElement;
    if (!is_list_node(target)) {
        if(target.className == 'nodecontent') {
            target = target.parentNode;
        }
    }
    if (is_list_node(target)) {
        if(target.className == 'basic') {
            var link = _findLinkOfNode(target);
            if(link.length) {
                window.open(link, '_blank');
            }
        } else {
            toggle(target);
            set_lastnode(target);
        }
    }
}


function expand(node) {
    if (!is_exp(node)) return;
    if (node.className=='exp_active') 
      node.className='col_active';
    else 
        node.className='col';
    setSubClass(node,'subexp');
    //    getsub(node).className='subexp';
}

function collapse(node) {
  if (!is_col(node)) return;
  
if (node.className=='col_active')
    node.className='exp_active'
  else 
    node.className='exp';

 setSubClass(node,'sub');
//  getsub(node).className='sub';

}

function setSubClass(node,name) {
  sub = getsub(node);
  if (sub==null) return;
  sub.className=name;  
}

function toggle(target) {
    if(target == _firstLI()) return;
  if (!is_list_node(target)) return;
    if (is_col(target)) {
      target.className='exp';
      setSubClass(target,'sub');
      //      getsub(target).className='sub';
    }
    else if (is_exp(target)) {
      target.className='col';
      setSubClass(target,'subexp');
      //      getsub(target).className='subexp';
        for(i = 0; i<target.parentNode.childNodes.length; i++) {
            theNode = target.parentNode.childNodes[i]
            if (theNode != target && is_list_node(theNode)) {
                collapse(theNode);
            }
        }
        
    }
 
}

function expandAll(node) {
    if (node.className=='exp') {
        node.className='col';
        setSubClass(node,'subexp');
//        getsub(node).className='subexp';
    }
    var i;
    if (node.childNodes!=null) 
//    if (node.hasChildNodes()) 
        for ( i = 0; i<node.childNodes.length; i++)
            expandAll(node.childNodes[i]);
}

function collapseAll(node) {
    if  (node.className=='col') {
        node.className='exp';
        setSubClass(node,'sub');
//        getsub(node).className='sub';
    }
    var i;        
    if (node.childNodes!=null) 
// for opera   if (node.hasChildNodes()) 
        for ( i = 0; i<node.childNodes.length; i++)
            collapseAll(node.childNodes[i]);
}



function unFocus(node) {
     // unfocuses potential link that is to be hidden (if a==null there is no link so it should not be blurred).
     // tested with mozilla 1.7, 12.7.2004. /mn (
      intemp=parent_listnode(node);  
      a = get_link(intemp);     // added 6.4. to get keyboard working with
      // moved before collapse to prevent an error message with IE when readonly==true      
      if (a!=null) a.blur(); // netscape after collapsing a focused node
      return intemp;
}

// mode: 0==keypress, 1==keyup
function keyfunc(evt,mode) {
 var c = get_keycode(evt);
 var temp = null;
 var a = null;

  if (lastnode==null) {
    listnodes = document.getElementsByTagName('li');
    lastnode=listnodes[1];
    temp=listnodes[1];
  }

  //window.alert(c);
  if (checkup(mode,c)) { // i 
   temp=prev_sibling_listnode(lastnode);
  }
  else if (checkdn(mode,c)) { // k
    temp=next_sibling_listnode(lastnode);
  }
  else if (checkr(mode,c)) { // l
    expand(lastnode);
    //  temp=next_child_listnode(lastnode);
    // if (temp==null) {
      a = get_link(lastnode);
        if (a!=null) a.focus(); else self.focus(); 
      //}
  }
  else if (checkl(mode,c)) { // j
    if (is_col(lastnode)) {
      unFocus(lastnode);
      collapse(lastnode);
    }
    else {
      temp=unFocus(lastnode);
      collapse(temp);
    }
   //    if (temp==null) lastnode.focus(); // forces focus to correct div (try mozilla typesearch) (doesn't seem to work -mn/6.4.2004)
  }
  else return;
  if (temp!=null) set_lastnode(temp);

  // alert('pressed ' + String.fromCharCode(c) + '(' + c + ')');
  return true;
}


function keytest (evt) {
  return keyfunc(evt,1);
};


function presstest (evt) {
  return keyfunc(evt,0);
};


function prepareNode(aNode) {
    if ((aNode.nodeName == 'A' || aNode.nodeName == 'a') && aNode.parentNode.className == 'nodecontent' && aNode.firstChild.nodeName == "#text") {
        newNode = aNode.firstChild;
        aNode.parentNode.replaceChild(newNode, aNode);
        ;
    } else if (aNode.hasChildNodes()) {
        for(var i = 0; i<aNode.childNodes.length; i++) {
            prepareNode(aNode.childNodes[i]);
        }
    }
}

function _firstLI() {
    var base = document.getElementById('base');
    var first = base.getElementsByTagName('li')[0];
    return first;
}

function prepareExpand() {
    var base = document.getElementById('base');
    collapseAll(base);
    
    var first = _firstLI();
    expand(first);
}

function _searchNodeWithKeyword(aNode, aKeyword) {
    var hasResult = false;
    if (aNode.className == 'nodecontent') {
        if(aNode.textContent.toLowerCase().indexOf(aKeyword.toLowerCase()) >= 0) {
            hasResult = true;
        }
    } else {
        if (aNode.hasChildNodes && (aNode.nodeName == "LI" || aNode.nodeName == "UL")) {
            for(var i = 0; i < aNode.childNodes.length; i++) {
                if (_searchNodeWithKeyword(aNode.childNodes[i], aKeyword)) {
                    hasResult = true;
                }
            }
            
            aNode.style.display = hasResult ? "block" : "none";
        }
    }

    return hasResult;
}

function _resetStyleOfNode(aNode) {
    if (aNode.style != null) {
        if (aNode.style.display) {
            aNode.style.display = "";
        }
    }
    if (aNode.hasChildNodes) {
        for (var i = 0; i < aNode.childNodes.length; i++) {
            _resetStyleOfNode(aNode.childNodes[i]);
        }
    }
}

function searchText(aKeyword) {
    var first = _firstLI();

    if (aKeyword.length > 0) {
//        _resetStyleOfNode(first);
        _searchNodeWithKeyword(first, aKeyword);
    } else {
        _resetStyleOfNode(first);
        prepareExpand();
    }
}

function prepareTop() {
    theTop = document.getElementsByClassName('basetop')[0];
    while(theTop.firstChild) {
        theTop.removeChild(theTop.firstChild);
    }
    
    {
        theDiv = document.createElement('div');
        theTip = document.createTextNode('搜索单词，不要输入多个词');
        theDiv.appendChild(theTip);
        theTop.appendChild(theDiv);
    }
    
    {
        
        theInput = document.createElement('input');
        theInput.setAttribute('type', 'text');
        theInput.setAttribute('onkeyup', 'searchText(this.value)');
        theInput.setAttribute('placeholder', '例如登录、push等等')
        theTop.appendChild(theInput);
    }
}

function prepareOpenNewLink() {
    theHead = document.head;
    
    theBase = document.createElement('base');
    theBase.setAttribute('target', '_blank');
    
    theHead.appendChild(theBase);
}

  document.onclick = onClickHandler;
document.addEventListener("DOMContentLoaded", function(event) {
                          var first = _firstLI();
                          prepareNode(first);
                          prepareExpand();
                          prepareTop();
                          prepareOpenNewLink();
                          });
//  document.onkeypress = presstest;
//  document.onkeyup = keytest;

