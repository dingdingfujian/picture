/**
 * Created by Administrator on 2015-05-12.
 */
window.onload=function(){
    waterfall('main','pin');            //瀑布流函数
    over();                             //对图片操作的函数
    var dataInt={'data':[{'src':'8.jpg'},{'src':'1.jpg'},{'src':'15.jpg'},{'src':'17.jpg'},{'src':'18.jpg'},{'src':'19.jpg'},{'src':'20.jpg'},{'src':'21.jpg'},{'src':'22.jpg'},{'src':'4.jpg'},{'src':'24.jpg'},{'src':'25.jpg'}]};//加入图片源
    window.onscroll=function(){         //滚动鼠标时，生成div盒子，包含图片和操作栏
        if(checkscoll('main','pin')){   //判断鼠标是否滚到底部，若是新增一些盒子
            var parent=document.getElementById('main');
            for(var i=0;i<dataInt.data.length;i++){
                var opin=document.createElement('div');
                opin.className='pin';
                parent.appendChild(opin);

                var obox=document.createElement('div');
                obox.className='box';
                opin.appendChild(obox);
                var img=document.createElement('img');
                img.src='./images/'+dataInt.data[i].src;
                img.className='img';
                obox.appendChild(img);

                var oab=document.createElement('div');
                oab.className='ab';
                opin.appendChild(oab);
                var of=document.createElement('div');
                of.className='a f';
                of.title='放大';
                oab.appendChild(of);
                var img=document.createElement('img');
                img.src='./images/p.png';
                img.className='i';
                of.appendChild(img);
                var om=document.createElement('div');
                om.className='a m';
                om.title='旋转';
                oab.appendChild(om);
                var img1=document.createElement('img');
                img1.src='./images/t.png';
                img1.className='i';
                om.appendChild(img1);
                var ol=document.createElement('div');
                ol.className='a l';
                ol.title='缩小';
                oab.appendChild(ol);
                var img2=document.createElement('img');
                img2.src='./images/d.png';
                img2.className='i';
                ol.appendChild(img2);
            }
        }
        waterfall('main','pin');
        over();
    }
}

function waterfall(parent,child){
    var oparent=document.getElementById(parent);//获得ID为parent的节点oparent
    var ochild=getChild(oparent,child);         //获得oparent的所有类名为child的节点，并放入ochild中
    var dw=ochild[0].offsetWidth;               //获得第一个ochild盒子的宽度
    var num=Math.floor(document.documentElement.clientWidth/dw);//计算一行能放的盒子数量
    oparent.style.cssText='width:'+num*dw+'px; margin:0 auto;';//修改oparent盒子的宽度
    var HArr=[];                                //定义高度数组
    for(var i=0;i<ochild.length;i++){
        var H=ochild[i].offsetHeight;           //每个ochild盒子的高度
        if(i<num){                              //第一行的盒子
            HArr[i]=H;ochild[i].style.cssText='position:absolute; left:'+i*dw+'px;';//修改ochild盒子的位置
        }
        else {                                  //第二行及以下的盒子
            var	minH=Math.min.apply(null,HArr); //得到高度数组的最小值
            var minHI=getIn(HArr,minH);         //获得最小高度的盒子所在列数
            ochild[i].style.cssText='position:absolute; left:'+minHI*dw+'px; top:'+minH+'px;';//计算当前盒子的位置
            HArr[minHI]+=ochild[i].offsetHeight;//最小高度盒子的高度加当前盒子高度，即当前列的高度
        }
    }
}

function getChild(oparent,child){           //获得oparent的所有类名为child的节点，并放入ochild中
    var cchild=oparent.getElementsByTagName('*');
    var ochild=[];
    for(var i=0;i<cchild.length;i++){
        if(cchild[i].className==child){
            ochild.push(cchild[i]);
        }
    }
    return ochild;
}

function getIn(HArr,minH){                   //获得最小高度的元素所在列数
    for(var i in HArr){
        if(HArr[i]==minH)
            return i;
    }

}

function checkscoll(main,pin){
    var parent=document.getElementById(main);
    var child=getChild(parent,pin);;
    var Last=child[child.length-1].offsetTop+Math.floor(child[child.length-1].offsetHeight/2);//最后一个盒子距页面顶端的高度加上自身高度的一半
    var wh=document.documentElement.clientHeight; //屏幕高度
    var sT=document.documentElement.scrollTop||document.body.scrollTop;//鼠标滚动高度
    return (Last<(wh+sT)?true:false);             //判断是否新增盒子
}

function over() {
    var x1 = [], y1 = [],x2 = [],y2 = [];
    var k = document.getElementById('main').getElementsByClassName('pin');
    for (var i = 0; i < k.length; i++) {
        x1[i] = k[i].offsetLeft;            //保存每个盒子的位置
        y1[i] = k[i].offsetTop;
    }
    for (var i = 0; i < k.length; i++) {
        var paraTrans = function (i) {
            var p=0;
            k[i].onclick = function () { //点击选中图片
                for (var j = 0; j < k.length; j++) {
                    k[j].id = "";
                }
                rDrag.init(this);       //拖动图片的函数
                k[i].id = "select";     //点击图片时放大当前的图片，以便对其进行操作
                play(k[i]);             //显示操作栏
                big(k[i]);              //放大图片
                p=turn(k[i],p);         //旋转图片
                small(k[i],p);          //缩小图片
            }
           k[i].ondblclick = function () { //双击取消选中
                this.id = "";
                this.style.left=x1[i]+'px';      //取消选中的图片，返回原来的位置
                this.style.top=y1[i]+'px';
                miss(this);                      //隐藏操作栏
                bigb(this);                      //还原原来图片的样式
            }
        }
        paraTrans(i);
    }
}

var rDrag = {
    o:null,
    init:function(o){   //初始化
        o.onmousedown = this.start;     //鼠标按下，开始“拖动” 函数
    },
    start:function(e){
        var o;
        e = rDrag.fixEvent(e);          //设置事件参数
        e.preventDefault && e.preventDefault();//阻止执行与事件关联的默认动作
        rDrag.o = o = this;
        o.x = e.clientX - rDrag.o.offsetLeft;//鼠标点击位置距左边距及上边距的距离
        o.y = e.clientY - rDrag.o.offsetTop;
        document.onmousemove = rDrag.move;   //鼠标移动时执行move函数
        document.onmouseup = rDrag.end;      //鼠标抬起时执行end函数
    },
    move:function(e){
        e = rDrag.fixEvent(e);
        var oLeft,oTop;
        oLeft = e.clientX - rDrag.o.x;       //盒子距父类左端及上端的距离
        oTop = e.clientY - rDrag.o.y;
        rDrag.o.style.left = oLeft + 'px';   //修改盒子位置
        rDrag.o.style.top = oTop + 'px';
    },
    end:function(e){
        e = rDrag.fixEvent(e);                //结束盒子移动，清空鼠标事件
        rDrag.o = document.onmousemove = document.onmouseup = null;
    },
    fixEvent: function(e){
        if (!e) {
            e = window.event;
            e.target = e.srcElement;
            e.layerX = e.offsetX;
            e.layerY = e.offsetY;
        }
        return e;
    }
}

function play(o){                         //通过改变ID显示操作栏
   var ob=o.getElementsByClassName('ab');
    ob[0].id='ab';
}

function miss(o){                         //隐藏操作栏
    var ob=o.getElementsByClassName('ab');
    ob[0].id='';
}

function big(o){
    var b= o.getElementsByClassName('box');
    var c= b[0].getElementsByClassName('img');
    var oc= o.getElementsByClassName('a f');
    var x2= c[0].width;
    var y2=c[0].height;


    oc[0].onclick=function(){             //点击盒子将图片放大1.2倍
     c[0].style.cssText='width:'+1.2*x2+'px;height:'+1.2*y2+'px;';
    }
}
function turn(o,k){
    k++;
    var b= o.getElementsByClassName('box');
    var oc= o.getElementsByClassName('a m');
    var c= b[0].getElementsByClassName('img');
    var x2= c[0].width;
    var y2=c[0].height;
    oc[0].onclick=function(){             //点击盒子将图片旋转90度
        b[0].style.cssText='transform:rotate('+90*k+'deg); -webkit-transform:rotate('+90*k+'deg);width:'+x2+'px;height:'+y2+'px;';
    }
    return k;
}


function small(o,k){
    var b= o.getElementsByClassName('box');
    var c= b[0].getElementsByClassName('img');
    var oc= o.getElementsByClassName('a l');
    var x2= c[0].width;
    var y2=c[0].height;
    var x3= b[0].width;
    var y3=b[0].height;
    oc[0].onclick=function(){              //点击盒子将图片缩小1.2倍
        c[0].style.cssText='width:'+x2/1.2+'px;height:'+y2/1.2+'px;';
        b[0].style.cssText='width:'+x3/1.2+'px;height:'+y3/1.2+'px;';

    }
}

function bigb(o){
    var b= o.getElementsByClassName('box');
    var c= b[0].getElementsByClassName('img');
    c[0].style.cssText='width:160 px;height:auto;';//恢复为图片未点击时的样式
    b[0].style.cssText='transform:rotate(0 deg); -webkit-transform:rotate(0 deg);';
}
