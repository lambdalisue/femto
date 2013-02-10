var utils={},Editor,Widget,occurrences,__hasProp={}.hasOwnProperty,__extends=function(a,b){function d(){this.constructor=a}for(var c in b)__hasProp.call(b,c)&&(a[c]=b[c]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a};utils.type=function(a){var b,c,d,e,f,g;if(a===void 0||a===null)return String(a);b=new Object,g="Boolean Number String Function Array Date RegExp".split(" ");for(e=0,f=g.length;e<f;e++)d=g[e],b["[object "+d+"]"]=d.toLowerCase();return c=Object.prototype.toString.call(a),c in b?b[c]:"object"},"use strict",utils.Selection=utils.W3CSelection=function(){function a(a){this.textarea=a}return a.prototype._getCaret=function(){var a,b;return b=this.textarea.selectionStart,a=this.textarea.selectionEnd,[b,a]},a.prototype._setCaret=function(a,b){return this.textarea.setSelectionRange(a,b),this},a.prototype._getWholeText=function(){return this.textarea.value},a.prototype._setWholeText=function(a){return this.textarea.value=a,this},a.prototype._replace=function(a,b,c){var d,e,f;return f=this._getWholeText(),e=f.substring(0,b),d=f.substring(c),this._setWholeText(e+a+d)},a.prototype.caret=function(a,b){var c,d;return a==null?this._getCaret():b==null?(c=this._getCaret(),this.caret(c[0]+a,c[1]+a)):(d=this.textarea.scrollTop,this._setCaret(a,b),this.textarea.scrollTop=d,this)},a.prototype.text=function(a,b){var c,d,e,f;return f=this._getCaret(),d=f[0],c=f[1],a==null?this._getWholeText().substring(d,c):(e=this.textarea.scrollTop,this._replace(a,d,c),c=d+a.length,b||(d=c),this._setCaret(d,c),this.textarea.scrollTop=e,this)},a.prototype.lineCaret=function(a,b){var c,d,e,f;if(a==null||b==null)f=this._getCaret(),d=f[0],c=f[1],a=a!=null?a:d,b=b!=null?b:c;return e=this._getWholeText(),a=e.lastIndexOf("\n",a-1)+1,b=e.indexOf("\n",b),b===-1&&(b=e.length),[a,b]},a.prototype.lineText=function(a,b){var c,d,e,f;return f=this.lineCaret(),d=f[0],c=f[1],a==null?this._getWholeText().substring(d,c):(e=this.textarea.scrollTop,this._replace(a,d,c),c=d+a.length,b||(d=c),this._setCaret(d,c),this.textarea.scrollTop=e,this)},a.prototype.insertBefore=function(a,b){var c,d,e,f,g;return g=this._getCaret(),d=g[0],c=g[1],f=this.text(),e=this.textarea.scrollTop,this._replace(a+f,d,c),c=d+a.length,b||(d=c),this._setCaret(d,c),this.textarea.scrollTop=e,this},a.prototype.insertAfter=function(a,b){var c,d,e,f,g;return g=this._getCaret(),d=g[0],c=g[1],f=this.text(),e=this.textarea.scrollTop,this._replace(f+a,d,c),d=c,c+=a.length,b||(d=c),this._setCaret(d,c),this.textarea.scrollTop=e,this},a.prototype.enclose=function(a,b,c){var d,e,f,g,h,i,j;return i=this.text(),g=this.textarea.scrollTop,e=i.lastIndexOf(b),i.indexOf(a)===0&&e===i.length-b.length?(h=i.substring(a.length,i.length-b.length),this.text(h,c)):(j=this._getCaret(),f=j[0],d=j[1],this._replace(a+i+b,f,d),d=f+a.length+i.length+b.length,c||(f=d),this._setCaret(f,d)),this.textarea.scrollTop=g,this},a.prototype.insertBeforeLine=function(a,b){var c,d,e,f,g;return g=this.lineCaret(),d=g[0],c=g[1],f=this.lineText(),e=this.textarea.scrollTop,this._replace(a+f,d,c),c=d+a.length,b||(d=c),this._setCaret(d,c),this.textarea.scrollTop=e,this},a.prototype.insertAfterLine=function(a,b){var c,d,e,f,g;return g=this.lineCaret(),d=g[0],c=g[1],f=this.lineText(),e=this.textarea.scrollTop,this._replace(f+a,d,c),d=c,c+=a.length,b||(d=c),this._setCaret(d,c),this.textarea.scrollTop=e,this},a.prototype.encloseLine=function(a,b,c){var d,e,f,g,h,i,j;return i=this.lineText(),g=this.textarea.scrollTop,e=i.lastIndexOf(b),i.indexOf(a)===0&&e===i.length-b.length?(h=i.substring(a.length,i.length-b.length),this.text(h,c)):(j=this.lineCaret(),f=j[0],d=j[1],this._replace(a+i+b,f,d),d=f+a.length+i.length+b.length,c||(f=d),this._setCaret(f,d)),this.textarea.scrollTop=g,this},a}(),document.selection!=null&&(occurrences=function(a,b,c){var d,e,f;a+="",b+="";if(b.length<=0)return a.length+1;d=e=0,f=c?1:b.length;for(;;){e=a.indexOf(b,e);if(e>=0)d++,e+=f;else break}return d},utils.Selection=utils.IESelection=function(a){function b(a){this.textarea=a,this._document=this.textarea.ownerDocument}return __extends(b,a),b.prototype._getWholeText=function(){var a;return a=this.textarea.value,a=a.replace(/\r\n/g,"\n"),a},b.prototype._getCaret=function(){var a,b,c,d;return c=this._document.selection.createRange(),a=c.duplicate(),a.moveToElementText(this.textarea),a.setEndPoint("EndToEnd",c),d=a.text.length-c.text.length,b=d+c.text.length,b-=occurrences(c.text,"\r\n"),[d,b]},b.prototype._setCaret=function(a,b){var c;return c=this.textarea.createTextRange(),c.collapse(!0),c.moveStart("character",a),c.moveEnd("character",b-a),c.select(),this},b}(utils.W3CSelection)),utils.Originator=function(){function a(){}return a.prototype.createMemento=function(){throw Error("Not implemented yet")},a.prototype.setMemento=function(a){throw Error("Not implemented yet")},a}(),utils.Caretaker=function(){function a(a){this._originator=a,this._undoStack=[],this._redoStack=[],this._previous=null}return a.prototype.originator=function(a){return a!=null?(this._originator=a,this):this._originator},a.prototype.save=function(a){a=a||this.originator().createMemento();if(this._previous==null||this._previous!==a)this._undoStack.push(a),this._redoStack=[],this._previous=a;return this},a.prototype.undo=function(){var a;return this.canUndo()?(a=this.originator(),this._redoStack.push(a.createMemento()),a.setMemento(this._undoStack.pop()),this):this},a.prototype.redo=function(){var a;return this.canRedo()?(a=this.originator(),this._undoStack.push(a.createMemento()),a.setMemento(this._redoStack.pop()),this):this},a.prototype.canUndo=function(){return this._undoStack.length>0},a.prototype.canRedo=function(){return this._redoStack.length>0},a}(),typeof exports!="undefined"&&exports!==null&&(exports.Originator=Originator,exports.Caretaker=Caretaker),Widget=function(a,b){var c,d,e;return a==null&&(a="<div>"),a instanceof jQuery?c=a:c=$(a,b),e=jQuery.prototype.outerWidth,d=jQuery.prototype.outerHeight,c.nonContentWidth=function(a){return a==null&&(a=!1),e.call(this,a)-this.width()},c.nonContentHeight=function(a){return a==null&&(a=!1),d.call(this,a)-this.height()},c.outerWidth=function(a,b){var c;return utils.type(a)==="number"&&(b=a,a=!1),b==null?e.call(this):(c=this.nonContentWidth(a),this.width(b-c))},c._outerHeight=c.outerHeight,c.outerHeight=function(a,b){var c;return utils.type(a)==="number"&&(b=a,a=!1),b==null?d.call(this):(c=this.nonContentHeight(a),this.height(b-c))},c.widget=!0,c},Editor=function(a){var b,c;return a=Widget(a),a.css({margin:"0",padding:"0",border:"none",outline:"none",resize:"none"}),a.createMemento=a.val,a.setMemento=a.val,c=Widget(),c.addClass("panel").addClass("editor"),c.append(a),c.textarea=a,c.adjust=function(){return a.outerWidth(!0,this.width()),a.outerHeight(!0,this.height())},c.val=function(){return a.val.apply(a,arguments)},c.caretaker=b=(new utils.Caretaker(a)).save(),a.on("keydown",function(a){var c;if((c=a.which)===13||c===9||c===8||c===46)return b.save()}),a.on("paste,drop",function(a){return b.save()}),c},describe("utils.type",function(){var a,b,c,d,e,f,g,h;d=utils.type,a=[[0,"number"],[1.2,"number"],[[0,1],"array"],[new Array,"array"],[{0:1},"object"],[null,"null"],[void 0,"undefined"],[NaN,"number"]],h=[];for(e=0,f=a.length;e<f;e++)g=a[e],b=g[0],c=g[1],h.push(function(a,b){return it("should return '"+b+"' for `"+a+"`",function(){return expect(d(a)).to.be.eql(b)})}(b,c));return h}),describe("utils.Selection",function(){var a,b,c,d,e,f,g,h,i,j,k,l,m;f=d=g=null,a=utils.Selection,before(function(){return f=document.createElement("textarea"),f.rollback=function(){return this.value="AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"},f.rollback(),g=function(){return f.value.replace(/\r\n/g,"\n")},d=new a(f),document.body.appendChild(f),f.focus()}),afterEach(function(){return f.rollback()}),c=["_getCaret","_setCaret","_replace"],h=function(a){return it("instance should have private `"+a+"` method",function(){return expect(d).to.have.property(a),expect(d[a]).to.be.a("function")})};for(j=0,l=c.length;j<l;j++)e=c[j],h(e);b=["caret","text","lineCaret","lineText","insertBefore","insertAfter","enclose","insertBeforeLine","insertAfterLine","encloseLine"],i=function(a){return it("instance should have public `"+a+"` method",function(){return expect(d).to.have.property(a),expect(d[a]).to.be.a("function")})};for(k=0,m=b.length;k<m;k++)e=b[k],i(e);return describe("#caret(s, e) -> [s, e] | instance",function(){return it("should return current caret position as a list when called without any arguments",function(){var a;return d.caret(0,0),a=d.caret(),expect(a).to.be.a("array"),expect(a).to.be.eql([0,0])}),it("should return the instance when called with arguments",function(){var b;return b=d.caret(0,0),expect(b).to.be.a(a),expect(b).to.be.eql(d),b=d.caret(0),expect(b).to.be.a(a),expect(b).to.be.eql(d)}),it("should change caret position to specified when called with two arguments",function(){var a;return a=d.caret(1,2).caret(),expect(a).to.be.eql([1,2])}),it("should change caret position with specified offset when called with one argument",function(){var a,b;return b=d.caret(0,0).caret(),a=d.caret(5).caret(),expect(a).to.be.eql([b[0]+5,b[1]+5])})}),describe("#text(text, keepSelection) -> string | instance",function(){return it("should return current selected text when called without any arguments",function(){var a;return d.caret(0,0),a=d.text(),expect(a).to.be.a("string"),expect(a).to.be.eql(""),d.caret(5,26),a=d.text(),expect(a).to.be.eql("BBBBBCCCCC\naaaaabbbbb")}),it("should return the instance when called with arguments",function(){var b;return d.caret(0,0),b=d.text("HELLO"),expect(b).to.be.a(a),expect(b).to.be.eql(d),f.rollback(),b=d.text("HELLO",!0),expect(b).to.be.a(a),expect(b).to.be.eql(d)}),it("should insert text before the caret when no text is selected and called with one argument",function(){var a;return d.caret(0,0),a=d.text("HELLO"),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")}),it("should insert text before the caret and select insertion when no text is selected and called with two arguments",function(){var a,b;return d.caret(0,0),b=d.text("HELLO",!0),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,5])}),it("should replace text of selected when text is selected and called with one argument",function(){var a;return d.caret(3,12),a=d.text("HELLO"),expect(g()).to.be.eql("AAAHELLOCCC\naaaaabbbbbccccc\n111112222233333")}),it("should replace text of selected and select replacement when text is selected and called with two arguments",function(){var a,b;return d.caret(3,12),b=d.text("HELLO",!0),expect(g()).to.be.eql("AAAHELLOCCC\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([3,8])})}),describe("#lineCaret(s, e) -> [s, e]",function(){return it("should return current line caret position as a list when called without any arguments",function(){var a;return d.caret(5,26),a=d.lineCaret(),expect(a).to.be.a("array"),expect(a).to.be.eql([0,31])}),it("should return specified line caret position as a list when called with arguments",function(){var a;return d.caret(0,0),a=d.lineCaret(5,26),expect(a).to.be.a("array"),expect(a).to.be.eql([0,31]),expect(d.caret()).to.be.eql([0,0])})}),describe("#lineText(text, keepSelection) -> string | instance",function(){return it("should return current selected line text when called without any arguments",function(){var a;return d.caret(0,0),a=d.lineText(),expect(a).to.be.a("string"),expect(a).to.be.eql("AAAAABBBBBCCCCC"),d.caret(5,26),a=d.lineText(),expect(a).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc")}),it("should return the instance when called with arguments",function(){var b;return d.caret(0,0),b=d.lineText("HELLO"),expect(b).to.be.a(a),expect(b).to.be.eql(d),f.rollback(),b=d.lineText("HELLO",!0),expect(b).to.be.a(a),expect(b).to.be.eql(d)}),it("should replace single line of caret position when no text is selected and called with one argument",function(){var a;return d.caret(0,0),a=d.lineText("HELLO"),expect(g()).to.be.eql("HELLO\naaaaabbbbbccccc\n111112222233333")}),it("should replace single line of caret position and select insertion when no text is selected and called with two arguments",function(){var a,b;return d.caret(0,0),b=d.lineText("HELLO",!0),expect(g()).to.be.eql("HELLO\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,5])}),it("should replace lines of selection when text is selected and called with one argument",function(){var a;return d.caret(5,26),a=d.lineText("HELLO"),expect(g()).to.be.eql("HELLO\n111112222233333")}),it("should replace lines of selection and select replacement when text is selected and called with two arguments",function(){var a,b;return d.caret(5,26),b=d.lineText("HELLO",!0),expect(g()).to.be.eql("HELLO\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,5])})}),describe("#insertBefore(text, keepSelection) -> instance",function(){return it("should return the instance when called with arguments",function(){var b;return d.caret(0,0),b=d.insertBefore("HELLO"),expect(b).to.be.a(a),expect(b).to.be.eql(d),f.rollback(),b=d.insertBefore("HELLO",!0),expect(b).to.be.a(a),expect(b).to.be.eql(d)}),it("should insert text before the caret when no text is selected and called with one argument",function(){var a;return d.caret(0,0),a=d.insertBefore("HELLO"),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")}),it("should insert text before the caret and select insertion when no text is selected and called with two arguments",function(){var a,b;return d.caret(0,0),b=d.insertBefore("HELLO",!0),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,5])}),it("should insert text before the selection when text is selected and called with one argument",function(){var a;return d.caret(0,5),a=d.insertBefore("HELLO"),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")}),it("should insert text before the selection and select insertion when text is selected and called with two arguments",function(){var a,b;return d.caret(0,5),b=d.insertBefore("HELLO",!0),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,5])})}),describe("#insertAfter(text, keepSelection) -> instance",function(){return it("should return the instance when called with arguments",function(){var b;return d.caret(0,0),b=d.insertAfter("HELLO"),expect(b).to.be.a(a),expect(b).to.be.eql(d),f.rollback(),b=d.insertAfter("HELLO",!0),expect(b).to.be.a(a),expect(b).to.be.eql(d)}),it("should insert text after the caret when no text is selected and called with one argument",function(){var a;return d.caret(0,0),a=d.insertAfter("HELLO"),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")}),it("should insert text after the caret and select insertion when no text is selected and called with two arguments",function(){var a,b;return d.caret(0,0),b=d.insertAfter("HELLO",!0),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,5])}),it("should insert text after the selection when text is selected and called with one argument",function(){var a;return d.caret(0,5),a=d.insertAfter("HELLO"),expect(g()).to.be.eql("AAAAAHELLOBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")}),it("should insert text after the selection and select insertion when text is selected and called with two arguments",function(){var a,b;return d.caret(0,5),b=d.insertAfter("HELLO",!0),expect(g()).to.be.eql("AAAAAHELLOBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([5,10])})}),describe("#enclose(lhs, rhs, keepSelection) -> instance",function(){return it("should return the instance when called with arguments",function(){var b;return d.caret(0,0),b=d.enclose("HELLO","WORLD"),expect(b).to.be.a(a),expect(b).to.be.eql(d),f.rollback(),b=d.enclose("HELLO","WORLD",!0),expect(b).to.be.a(a),expect(b).to.be.eql(d)}),it("should insert both text before the caret when no text is selected and called with two arguments",function(){var a;return d.caret(0,0),a=d.enclose("HELLO","WORLD"),expect(g()).to.be.eql("HELLOWORLDAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")}),it("should insert both text before the caret and select insertion when no text is selected and called with three arguments",function(){var a,b;return d.caret(0,0),b=d.enclose("HELLO","WORLD",!0),expect(g()).to.be.eql("HELLOWORLDAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,10])}),it("should enclose the selection with specified when text is selected and called with two arguments",function(){var a;return d.caret(0,5),a=d.enclose("HELLO","WORLD"),expect(g()).to.be.eql("HELLOAAAAAWORLDBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")}),it("should enclose the selection with specified and select text include insertion when text is selected and called with two arguments",function(){var a,b;return d.caret(0,5),b=d.enclose("HELLO","WORLD",!0),expect(g()).to.be.eql("HELLOAAAAAWORLDBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,15])}),it("should remove specified when selected text (or caret) is enclosed and called with two arguments",function(){return d.caret(0,0),d.enclose("HELLO","WORLD",!0),d.enclose("HELLO","WORLD"),expect(g()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),d.caret(5,10),d.enclose("HELLO","WORLD",!0),d.enclose("HELLO","WORLD"),expect(g()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")}),it("should remove specified and select text when selected text (or caret) is enclosed and called with three arguments",function(){var a;return d.caret(0,0),d.enclose("HELLO","WORLD",!0),d.enclose("HELLO","WORLD",!0),expect(g()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,0]),d.caret(5,10),d.enclose("HELLO","WORLD",!0),d.enclose("HELLO","WORLD",!0),expect(g()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([5,10])})}),describe("#insertBeforeLine(text, keepSelection) -> instance",function(){return it("should return the instance when called with arguments",function(){var b;return d.caret(0,0),b=d.insertBeforeLine("HELLO"),expect(b).to.be.a(a),expect(b).to.be.eql(d),f.rollback(),b=d.insertBeforeLine("HELLO",!0),expect(b).to.be.a(a),expect(b).to.be.eql(d)}),it("should insert text before the current line when no text is selected and called with one argument",function(){var a;return d.caret(0,0),a=d.insertBeforeLine("HELLO"),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")}),it("should insert text before the current line and select insertion when no text is selected and called with two arguments",function(){var a,b;return d.caret(0,0),b=d.insertBeforeLine("HELLO",!0),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,5])}),it("should insert text before the line of the selection when text is selected and called with one argument",function(){var a;return d.caret(0,5),a=d.insertBeforeLine("HELLO"),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")}),it("should insert text before the line of the selection and select insertion when text is selected and called with two arguments",function(){var a,b;return d.caret(0,5),b=d.insertBeforeLine("HELLO",!0),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,5])})}),describe("#insertAfterLine(text, keepSelection) -> instance",function(){return it("should return the instance when called with arguments",function(){var b;return d.caret(0,0),b=d.insertAfterLine("HELLO"),expect(b).to.be.a(a),expect(b).to.be.eql(d),f.rollback(),b=d.insertAfterLine("HELLO",!0),expect(b).to.be.a(a),expect(b).to.be.eql(d)}),it("should insert text after the current line when no text is selected and called with one argument",function(){var a;return d.caret(0,0),a=d.insertAfterLine("HELLO"),expect(g()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333")}),it("should insert text after the current line and select insertion when no text is selected and called with two arguments",function(){var a,b;return d.caret(0,0),b=d.insertAfterLine("HELLO",!0),expect(g()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([15,20])}),it("should insert text after the line of the selection when text is selected and called with one argument",function(){var a;return d.caret(0,5),a=d.insertAfterLine("HELLO"),expect(g()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333")}),it("should insert text after the line of the selection and select insertion when text is selected and called with two arguments",function(){var a,b;return d.caret(0,5),b=d.insertAfterLine("HELLO",!0),expect(g()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([15,20])})}),describe("#encloseLine(lhs, rhs, keepSelection) -> instance",function(){return it("should return the instance when called with arguments",function(){var b;return d.caret(0,0),b=d.encloseLine("HELLO","WORLD"),expect(b).to.be.a(a),expect(b).to.be.eql(d),f.rollback(),b=d.encloseLine("HELLO","WORLD",!0),expect(b).to.be.a(a),expect(b).to.be.eql(d)}),it("should insert both text before the current line when no text is selected and called with two arguments",function(){var a;return d.caret(0,0),a=d.encloseLine("HELLO","WORLD"),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333")}),it("should insert both text before the current line and select insertion when no text is selected and called with three arguments",function(){var a,b;return d.caret(0,0),b=d.encloseLine("HELLO","WORLD",!0),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,25])}),it("should encloseLine the line of the selection with specified when text is selected and called with two arguments",function(){var a;return d.caret(0,5),a=d.encloseLine("HELLO","WORLD"),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333")}),it("should encloseLine the line of the selection with specified and select text include insertion when text is selected and called with two arguments",function(){var a,b;return d.caret(0,5),b=d.encloseLine("HELLO","WORLD",!0),expect(g()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,25])}),it("should remove specified when selected text (or caret) is encloseLined and called with two arguments",function(){return d.caret(0,0),d.encloseLine("HELLO","WORLD",!0),d.encloseLine("HELLO","WORLD"),expect(g()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),d.caret(5,10),d.encloseLine("HELLO","WORLD",!0),d.encloseLine("HELLO","WORLD"),expect(g()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")}),it("should remove specified and select text when selected text (or caret) is encloseLined and called with three arguments",function(){var a;return d.caret(0,0),d.encloseLine("HELLO","WORLD",!0),d.encloseLine("HELLO","WORLD",!0),expect(g()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,15]),d.caret(5,10),d.encloseLine("HELLO","WORLD",!0),d.encloseLine("HELLO","WORLD",!0),expect(g()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"),a=d.caret(),expect(a).to.be.eql([0,15])})})}),describe("Widget",function(){var a,b,c,d,e;it("should return jQuery instance",function(){var a;return a=Widget(),expect(a).to.be.a(jQuery)}),it("should return same (but extended) jQuery instance when it specified",function(){var a,b;return a=jQuery("<div>"),b=Widget(a),expect(b).to.be.eql(a)}),it("should have `widget` property",function(){var a;return a=Widget(),expect(a).to.have.property("widget"),expect(a.widget).to.be.eql(!0)}),a=["nonContentWidth","nonContentHeight","outerWidth","outerHeight"],e=[];for(c=0,d=a.length;c<d;c++)b=a[c],e.push(function(a){return it("return instance should have `"+a+"` method",function(){var b;return b=Widget(),expect(b).to.have.property(a),expect(b[a]).to.be.a("function")})}(b));return e}),describe("utils.Originator",function(){var a,b,c,d,e;a=["createMemento","setMemento"],e=[];for(c=0,d=a.length;c<d;c++)b=a[c],e.push(function(a){return it("instance should have `"+a+"` method",function(){var b;return b=new utils.Originator,expect(b).to.have.property(a),expect(b[a]).to.be.a("function")})}(b));return e}),describe("utils.Caretaker",function(){var a,b,c,d,e,f,g,h;a=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return __extends(b,a),b.prototype.createMemento=function(){return this.memento},b.prototype.setMemento=function(a){return this.memento=a},b}(utils.Originator),b=new a,d=new utils.Caretaker(b),c=["originator","save","undo","redo","canUndo","canRedo"],f=function(a){return it("instance should have `"+a+"` method",function(){return expect(d).to.have.property(a),expect(d[a]).to.be.a("function")})};for(g=0,h=c.length;g<h;g++)e=c[g],f(e);return beforeEach(function(){return b.memento=null,d._undoStack=[],d._redoStack=[],d._previous=null,d._originator=b}),describe("#originator(originator) -> originator | instance",function(){return it("should return originator instance when called without any argument",function(){var c;return c=d.originator(),expect(c).to.be.a(a),expect(c).to.be.eql(b)}),it("should change originator and return the instance when called with a argument",function(){var b,c,e,f;return b=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return __extends(b,a),b.prototype.createMemento=function(){return this.memento+this.memento},b}(a),c=new b,f=d.originator(c),expect(f).to.be.eql(d),e=f.originator(),expect(e).to.be.a(b),expect(e).to.be.eql(c)})}),describe("#save(memento) -> instance",function(){return it("should return the instance",function(){var a;return a=d.save(),expect(a).to.be.eql(d),a=d.save("HELLO"),expect(a).to.be.eql(d)}),it("should call originator `createMemento()` method to get current memento without any argument"),it("should save new memento into `_undoStack` and change `_previous` when called without any argument",function(){return b.memento="HELLO",d.save(),expect(d._undoStack.length).to.be.eql(1),expect(d._undoStack[0]).to.be.eql("HELLO"),expect(d._previous).to.be.eql("HELLO")}),it("should save specified memento into `_undoStack` and change `_previous` when called with a argument",function(){return d.save("HELLO"),expect(d._undoStack.length).to.be.eql(1),expect(d._undoStack[0]).to.be.eql("HELLO"),expect(d._previous).to.be.eql("HELLO")}),it("should `push` a memento into `_undoStack` rather than `unshift`",function(){return d.save("HELLO1"),d.save("HELLO2"),d.save("HELLO3"),expect(d._undoStack.length).to.be.eql(3),expect(d._undoStack).to.be.eql(["HELLO1","HELLO2","HELLO3"])}),it("should not save a memento which is equal with the previous one",function(){return d.save("HELLO"),d.save("HELLO"),d.save("HELLO"),expect(d._undoStack.length).to.be.eql(1),expect(d._undoStack[0]).to.be.eql("HELLO")}),describe("#undo() -> instance",function(){return it("should return the instance",function(){var a;return a=d.undo(),expect(a).to.be.eql(d)}),it("should not do anything when nothing have saved on `_undoStack`",function(){return expect(b.memento).to.be.eql(null),expect(d._undoStack.length).to.be.eql(0),expect(d._redoStack.length).to.be.eql(0),expect(d._previous).to.be.eql(null),d.undo(),expect(b.memento).to.be.eql(null),expect(d._undoStack.length).to.be.eql(0),expect(d._redoStack.length).to.be.eql(0),expect(d._previous).to.be.eql(null)}),it("should call originator `createMemento()` method to get current value"),it("should call originator `setMemento(value)` method to change current value"),it("should pop previous memento from `_undoStack`",function(){var a,c,e,f;b.memento="HELLO1";for(a=c=2;c<=3;a=++c)d.save(),b.memento="HELLO"+a;expect(d._undoStack).to.be.eql(["HELLO1","HELLO2"]),f=[];for(a=e=3;e>=1;a=--e)expect(b.memento).to.be.eql("HELLO"+a),expect(d._undoStack.length).to.be.eql(a-1),f.push(d.undo());return f}),it("should push current memento to `_redoStack`",function(){var a,c,e;b.memento="HELLO1";for(a=c=2;c<=3;a=++c)d.save(),b.memento="HELLO"+a;for(a=e=3;e>=1;a=--e)expect(d._redoStack.length).to.be.eql(3-a),d.undo();return expect(d._redoStack).to.be.eql(["HELLO3","HELLO2"])})}),describe("#redo() -> instance",function(){return it("should return the instance",function(){var a;return a=d.redo(),expect(a).to.be.eql(d)}),it("should not do anything when nothing have saved on `_redoStack`",function(){return expect(b.memento).to.be.eql(null),expect(d._undoStack.length).to.be.eql(0),expect(d._redoStack.length).to.be.eql(0),expect(d._previous).to.be.eql(null),d.redo(),expect(b.memento).to.be.eql(null),expect(d._undoStack.length).to.be.eql(0),expect(d._redoStack.length).to.be.eql(0),expect(d._previous).to.be.eql(null)}),it("should call originator `createMemento()` method to get current value"),it("should call originator `setMemento(value)` method to change current value"),it("should pop further memento from `_redoStack`",function(){var a,c,e,f;b.memento="HELLO1";for(a=c=2;c<=3;a=++c)d.save(),b.memento="HELLO"+a;for(a=e=3;e>=1;a=--e)d.undo();expect(d._redoStack).to.be.eql(["HELLO3","HELLO2"]);for(a=f=1;f<=2;a=++f)expect(b.memento).to.be.eql("HELLO"+a),expect(d._redoStack.length).to.be.eql(3-a),d.redo();return expect(b.memento).to.be.eql("HELLO3")}),it("should push current memento to `_undoStack`",function(){var a,c,e,f;b.memento="HELLO1";for(a=c=2;c<=3;a=++c)d.save(),b.memento="HELLO"+a;for(a=e=3;e>=1;a=--e)d.undo();for(a=f=1;f<=2;a=++f)expect(b.memento).to.be.eql("HELLO"+a),expect(d._undoStack.length).to.be.eql(a-1),d.redo();return expect(d._undoStack).to.be.eql(["HELLO1","HELLO2"])})}),describe("#canUndo() -> boolean",function(){return it("should return boolean",function(){var a;return a=d.canUndo(),expect(a).to.be.a("boolean")}),it("should return `false` when `_undoStack` is empty",function(){var a;return a=d.canUndo(),expect(a).to.be["false"]}),it("should return `true` when `_undoStack` is not empty",function(){var a;return d.save("HELLO"),a=d.canUndo(),expect(a).to.be["true"]})}),describe("#canRedo() -> boolean",function(){return it("should return boolean",function(){var a;return a=d.canRedo(),expect(a).to.be.a("boolean")}),it("should return `false` when `_redoStack` is empty",function(){var a;return a=d.canRedo(),expect(a).to.be["false"]}),it("should return `true` when `_redoStack` is not empty",function(){var a;return d.save("HELLO"),d.undo(),a=d.canRedo(),expect(a).to.be["true"]})})})}),describe("Editor",function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;g=d=null,before(function(){return g=jQuery("<textarea>"),d=Editor(g)}),it("should return jQuery instance",function(){return expect(d).to.be.a(jQuery)}),a=["panel","editor"],i=function(a){return it("should have `"+a+"` class in its DOM element",function(){return expect(d.hasClass(a)).to.be["true"]})};for(l=0,o=a.length;l<o;l++)f=a[l],i(f);it("DOM element should have `textarea` DOM element in it",function(){var a;return a=d.children(),expect(a.length).to.be.eql(1),expect(a[0]).to.be.eql(d.textarea[0])}),c=[["textarea",jQuery],["caretaker",utils.Caretaker]],j=function(a,b){return it("return instance should have `"+a+"` property as `"+b.name+"`",function(){return expect(d).to.have.property(a),expect(d[a]).to.be.a(b)})};for(m=0,p=c.length;m<p;m++)r=c[m],f=r[0],h=r[1],j(f,h);b=["adjust","val"],k=function(a){return it("return instance should have `"+a+"` method",function(){return expect(d).to.have.property(a),expect(d[a]).to.be.a("function")})};for(n=0,q=b.length;n<q;n++)e=b[n],k(e);return describe("#textarea : An extended jQuery instance",function(){var a,c,h,i,j,k,l,m,n,o,p,q,r,s,t;it("should have `widget` property",function(){return expect(d.textarea).to.have.property("widget"),expect(d.textarea.widget).to.be.eql(!0)}),b=["createMemento","setMemento"],j=function(a){return it("should have `"+a+"` method",function(){return expect(d.textarea).to.have.property(a),expect(d.textarea[a]).to.be.a("function")})};for(m=0,n=b.length;m<n;m++)e=b[m],j(e);i=[["Return",13],["Tab",9],["Backspace",8],["Delete",46]],k=function(a,b){return it("should call `caretaker.save()` method when user press "+a)};for(q=0,o=i.length;q<o;q++)s=i[q],f=s[0],c=s[1],k(f,c);h=[["paste",null],["drop",null]],l=function(a,b){return it("should call `caretaker.save()` method when user "+a+" text")};for(r=0,p=h.length;r<p;r++)t=h[r],f=t[0],a=t[1],l(f,a);return describe("#createMemento() -> value",function(){return it("should return current value of the textarea",function(){var a;return g.val("HELLO"),a=g.createMemento(),expect(a).to.be.eql("HELLO"),g.val("HELLO2"),a=g.createMemento(),expect(a).to.be.eql("HELLO2"),g.val("")})}),describe("#setMemento(value) -> instance",function(){return it("should return the instance",function(){var a;return a=g.setMemento(""),expect(a).to.be.eql(g)}),it("should change current value of the textarea",function(){return g.setMemento("HELLO"),expect(g.val()).to.be.eql("HELLO"),g.setMemento("HELLO2"),expect(g.val()).to.be.eql("HELLO2"),g.val("")})})}),describe("#caretaker : utils.Caretaker instance",function(){return it("should use `textarea` as an originator",function(){var a;return a=d.caretaker.originator(),expect(a).to.be.eql(d.textarea)})}),describe("#val(value) -> value | instance",function(){return it("should return current value of the textarea when called without any argument",function(){var a;return d.textarea.val("HELLO"),a=d.val(),expect(a).to.be.eql("HELLO"),d.textarea.val("HELLO2"),a=d.val(),expect(a).to.be.eql("HELLO2"),d.textarea.val("")}),it("should change current value of the textarea when called with an argument",function(){return d.val("HELLO"),expect(d.val()).to.be.eql("HELLO"),d.val("HELLO2"),expect(d.val()).to.be.eql("HELLO2"),d.textarea.val("")})}),describe("#adjust() -> instance",function(){return it("should resize `outerWidth` of textarea to `width` of the instance",function(){var a,b;return d.adjust(),b=d.width(),a=d.textarea.outerWidth(!0),expect(a).to.be.eql(b)}),it("should resize `outerHeight` of textarea to `height` of the instance",function(){var a,b;return d.adjust(),a=d.height(),b=d.textarea.outerHeight(!0),expect(b).to.be.eql(a)})})})