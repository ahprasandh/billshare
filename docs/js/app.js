(function(e){function t(t){for(var s,i,r=t[0],c=t[1],l=t[2],d=0,p=[];d<r.length;d++)i=r[d],o[i]&&p.push(o[i][0]),o[i]=0;for(s in c)Object.prototype.hasOwnProperty.call(c,s)&&(e[s]=c[s]);u&&u(t);while(p.length)p.shift()();return a.push.apply(a,l||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],s=!0,r=1;r<n.length;r++){var c=n[r];0!==o[c]&&(s=!1)}s&&(a.splice(t--,1),e=i(i.s=n[0]))}return e}var s={},o={app:0},a=[];function i(t){if(s[t])return s[t].exports;var n=s[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=s,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)i.d(n,s,function(t){return e[t]}.bind(null,s));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/billshare/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],c=r.push.bind(r);r.push=t,r=r.slice();for(var l=0;l<r.length;l++)t(r[l]);var u=c;a.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";var s=n("64a9"),o=n.n(s);o.a},"269d":function(e,t,n){},"3a41":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("f751"),n("097d");var s=n("2b0e"),o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},a=[],i={name:"app",mounted:function(){this.init()},methods:{init:function(){}}},r=i,c=(n("034f"),n("2877")),l=Object(c["a"])(r,o,a,!1,null,null,null),u=l.exports,d=n("59ca"),p=n.n(d),m=(n("ea7b"),n("8c4f")),v=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"home"},[n("div",{staticClass:"tb"},[e._m(0),n("div",{staticClass:"tbB"},[n("div",{staticClass:"pN"},[n("div",[e._v("Hi "+e._s(e.currentUser.displayName))]),n("div",{staticClass:"lo",on:{click:e.logout}},[e._v("Logout")])])])]),n("div",{staticClass:"cW"},[0==e.personCollection.length?n("div",[e._v("No Persons Added")]):e._e(),n("div",{staticClass:"uW"},[e._l(e.personCollection,function(t){return n("div",[n("div",{domProps:{textContent:e._s(t.name)}}),e.isAdmin?n("div",{on:{click:function(n){return e.deletePeople(t.id)}}},[e._v("×")]):e._e()])}),e.isAdmin?n("NewPerson"):e._e()],2),n("div",{staticClass:"eW"},[e.isAdmin?n("NewExpense",{attrs:{personsCollection:e.personCollection}}):e._e()],1)])])},f=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"tbT"},[n("div",{staticClass:"pT"},[e._v("Expense Share")])])}],h=(n("a481"),n("cebc")),g=n("2f62"),b=(n("e71f"),{firebaseConfig:{apiKey:"AIzaSyB1gTLWPHWOHCZFhs1yGuouPZ_F9anANLw",authDomain:"billshare-4f2ac.firebaseapp.com",databaseURL:"https://billshare-4f2ac.firebaseio.com",projectId:"billshare-4f2ac",storageBucket:"billshare-4f2ac.appspot.com",messagingSenderId:"810948359815"},adminUid:"tMfUwcCyAlVEBjRT6oUVrRIjQ8v1"});p.a.initializeApp(b.firebaseConfig);var P=p.a.firestore(),_=p.a.auth(),C=_.currentUser,w=P.collection("persons"),x=P.collection("expenses"),y={db:P,auth:_,currentUser:C,personCollection:w,expenseCollection:x},O=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.isAdmin?n("div",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.name,expression:"name"}],attrs:{type:"text",placeholder:"Name"},domProps:{value:e.name},on:{input:function(t){t.target.composing||(e.name=t.target.value)}}}),n("button",{on:{click:e.addPerson}},[e._v("Add Person")])]):e._e()},A=[],E=(n("7f7f"),{name:"PersonEditor",computed:Object(h["a"])({},Object(g["b"])(["isAdmin"])),data:function(){return{name:"",photo:null}},methods:{addPerson:function(){if(this.name&&this.name.trim().length>1){var e={createdOn:new Date,name:this.name,photo:this.photo,id:123};this.$parent.personCollection.push(e)}}}}),j=E,N=Object(c["a"])(j,O,A,!1,null,null,null),U=N.exports,$=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.isAdmin?n("div",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.name,expression:"name"}],attrs:{type:"text",placeholder:"Expense Name"},domProps:{value:e.name},on:{input:function(t){t.target.composing||(e.name=t.target.value)}}}),n("input",{directives:[{name:"model",rawName:"v-model",value:e.cost,expression:"cost"}],attrs:{type:"number",placeholder:"Expense Amount"},domProps:{value:e.cost},on:{input:function(t){t.target.composing||(e.cost=t.target.value)}}}),n("div",{staticClass:"exPc"},[n("div",{staticClass:"exPcL"},[n("div",{staticClass:"exPcT"},[e._v("Billed Persons")]),e._l(e.selectedPersons,function(t,s){return n("div",{staticClass:"exPcP"},[e._m(0,!0),n("div",{staticClass:"pName",domProps:{textContent:e._s(t.name)}}),n("span",{staticClass:"currency"},[e._v("₹")]),n("input",{directives:[{name:"model",rawName:"v-model",value:t.cost,expression:"person.cost"}],attrs:{type:"number",disabled:"disabled"},domProps:{value:t.cost},on:{input:function(n){n.target.composing||e.$set(t,"cost",n.target.value)}}}),n("div",{staticClass:"but",on:{click:function(n){return e.removePerson(t,s)}}},[e._v("-")])])})],2),n("div",{staticClass:"exPcR"},[n("div",{staticClass:"exPcT"},[e._v("Available Persons")]),e._l(e.availablePersons,function(t,s){return n("div",{staticClass:"exPcP"},[e._m(1,!0),n("div",{staticClass:"pName",domProps:{textContent:e._s(t.name)}}),n("span",{staticClass:"currency"},[e._v("₹")]),n("input",{directives:[{name:"model",rawName:"v-model",value:t.cost,expression:"person.cost"}],attrs:{type:"number"},domProps:{value:t.cost},on:{input:function(n){n.target.composing||e.$set(t,"cost",n.target.value)}}}),n("div",{staticClass:"but",on:{click:function(n){return e.addPerson(t)}}},[e._v("+")])])})],2)]),n("button",{on:{click:e.addExpense}},[e._v("Add Expense")])]):e._e()},S=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"pCont"},[s("img",{staticClass:"pPic",attrs:{src:n("c824")}})])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"pCont"},[s("img",{staticClass:"pPic",attrs:{src:n("c824")}})])}],k=(n("28a5"),{name:"ExpenseEditor",computed:Object(h["a"])({},Object(g["b"])(["isAdmin"])),props:["personsCollection"],data:function(){return{name:"",cost:0,split:{amount:0,count:0},date:null,persons:{},selectedPersons:[],availablePersons:[]}},methods:{initPersons:function(){if(this.personsCollection)for(var e=0;e<this.personsCollection.length;e++){var t=this.personsCollection[e];this.availablePersons.push({id:t.id,name:t.name})}},addExpense:function(){if(this.name&&this.name.trim().length>1)new Date,this.name},addPerson:function(e,t){this.persons[e.id]||(this.persons[e.id]=e.name,this.selectedPersons.push({id:e.id,name:e.name}),this.availablePersons.splice(t,1),this.split.count=this.selectedPersons.length)},removePerson:function(e,t){this.persons[e.id]&&(delete this.persons[e.id],this.availablePersons.push({id:e.id,name:e.name}),this.selectedPersons.splice(t,1))},costReset:function(e){this.split.amount=e}},watch:{personsCollection:function(){this.initPersons()},cost:function(e){this.costReset(e)}}}),I=k,T=Object(c["a"])(I,$,S,!1,null,null,null),W=T.exports,L={name:"home",computed:Object(h["a"])({},Object(g["b"])(["currentUser","isAdmin"])),components:{NewPerson:U,NewExpense:W},mounted:function(){this.init()},data:function(){return{personCollection:[]}},methods:{logout:function(){var e=this;y.auth.signOut().then(function(){e.$store.commit("setCurrentUser",null),e.$router.replace("login")})},init:function(){this.personCollection=[{createdOn:{seconds:1551631222,nanoseconds:527e6},name:"Hari",photo:null,id:"jljVdu5aKMZs68OFVZlK",paid:!1,expenses:{}},{createdOn:{seconds:1551631222,nanoseconds:527e6},name:"Hari2",photo:null,id:"jljVdu5a1MZs68OFVZlK",paid:!1,expenses:{}}]},deletePeople:function(e){y.personCollection.doc(e).delete().then(function(){alert("Document successfully deleted!")}).catch(function(e){console.error("Error removing document: ",e)})}}},M=L,H=Object(c["a"])(M,v,f,!1,null,null,null),R=H.exports,V=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"login"},[s("img",{attrs:{src:n("cf05")}}),s("h3",[e._v("Sign In")]),s("input",{directives:[{name:"model",rawName:"v-model",value:e.email,expression:"email"}],attrs:{type:"text",placeholder:"Email"},domProps:{value:e.email},on:{input:function(t){t.target.composing||(e.email=t.target.value)}}}),s("br"),s("input",{directives:[{name:"model",rawName:"v-model",value:e.password,expression:"password"}],attrs:{type:"password",placeholder:"Password"},domProps:{value:e.password},on:{input:function(t){t.target.composing||(e.password=t.target.value)}}}),s("br"),s("button",{on:{click:e.login}},[e._v("Sign In")]),s("button",{on:{click:e.loginAsGuest}},[e._v("Sign In As Guest")])])},Z=[],B={name:"login",data:function(){return{email:"",password:""}},methods:{login:function(){var e=this;p.a.auth().signInWithEmailAndPassword(this.email,this.password).then(function(t){e.$router.replace("home"),e.$store.commit("setCurrentUser",t)},function(e){alert("Oops. "+e.message)})},loginAsGuest:function(){var e=this;p.a.auth().signInWithEmailAndPassword("guest@domain.com","guest@123").then(function(t){e.$router.replace("home")},function(t){p.a.auth().createUserWithEmailAndPassword("guest@domain.com","guest@123").then(function(t){e.$router.replace("home")},function(e){alert("Oops. "+e.message)})})}}},D=B,F=(n("e9d4"),Object(c["a"])(D,V,Z,!1,null,"bb29cc82",null)),G=F.exports,K=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"sign-up"},[s("img",{attrs:{src:n("cf05")}}),s("p",[e._v("Let's create a new account !")]),s("input",{directives:[{name:"model",rawName:"v-model",value:e.name,expression:"name"}],attrs:{type:"text",placeholder:"Name"},domProps:{value:e.name},on:{input:function(t){t.target.composing||(e.name=t.target.value)}}}),s("br"),s("input",{directives:[{name:"model",rawName:"v-model",value:e.email,expression:"email"}],attrs:{type:"text",placeholder:"Email"},domProps:{value:e.email},on:{input:function(t){t.target.composing||(e.email=t.target.value)}}}),s("br"),s("input",{directives:[{name:"model",rawName:"v-model",value:e.password,expression:"password"}],attrs:{type:"password",placeholder:"Password"},domProps:{value:e.password},on:{input:function(t){t.target.composing||(e.password=t.target.value)}}}),s("br"),s("button",{on:{click:e.signUp}},[e._v("Sign Up")]),s("span",[e._v("or go back to "),s("router-link",{attrs:{to:"/login"}},[e._v("login")]),e._v(".")],1)])},q=[],z={name:"signUp",data:function(){return{email:"",password:"",name:""}},methods:{signUp:function(){var e=this;p.a.auth().createUserWithEmailAndPassword(this.email,this.password).then(function(t){t.updateProfile({displayName:e.name}),e.$router.replace("home")},function(e){alert("Oops. "+e.message)})}}},J=z,Q=(n("b526"),Object(c["a"])(J,K,q,!1,null,"1a75f273",null)),X=Q.exports;s["a"].use(m["a"]);var Y=new m["a"]({routes:[{path:"*",redirect:"/login"},{path:"/",redirect:"/login"},{path:"/login",name:"Login",component:G},{path:"/sign-up",name:"SignUp",component:X},{path:"/home",name:"Home",component:R,meta:{requiresAuth:!0}}]});Y.beforeEach(function(e,t,n){var s=p.a.auth().currentUser,o=e.matched.some(function(e){return e.meta.requiresAuth});o&&!s?n("login"):!o&&s?n("home"):n()});var ee=Y;s["a"].use(g["a"]);var te=new g["a"].Store({state:{currentUser:null,isAdmin:!1},mutations:{setCurrentUser:function(e,t){e.currentUser=t,e.isAdmin=t&&t.uid===b.adminUid}},actions:{}});y.auth.onAuthStateChanged(function(e){e&&te.commit("setCurrentUser",e)});var ne=te;s["a"].config.productionTip=!1;var se="";y.auth.onAuthStateChanged(function(e){se||(se=new s["a"]({router:ee,store:ne,render:function(e){return e(u)}}).$mount("#app"))})},"64a9":function(e,t,n){},b526:function(e,t,n){"use strict";var s=n("269d"),o=n.n(s);o.a},c824:function(e,t,n){e.exports=n.p+"img/guest.svg"},cf05:function(e,t,n){e.exports=n.p+"img/logo.png"},e9d4:function(e,t,n){"use strict";var s=n("3a41"),o=n.n(s);o.a}});