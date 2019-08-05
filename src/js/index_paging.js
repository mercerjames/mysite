$(function(){

    var pageSize = 40;
    var totalSize = $(".good-list ul li:last").index()+1;
    var totalPage = Math.ceil(totalSize/pageSize);
    console.log("数据的总长度为："+totalSize)
    console.log("所需要页数的总长度为："+totalPage)
    
    var start = 0;
    var end = 39;
    for(var i=start;i<end;i++){
        $(".good-list ul li").eq(i).show()  
    }
    for(var i=end;i<totalSize-1;i++){
        $(".good-list ul li").eq(i).hide()  
    }
    var num = 1;
    $(".goods-pages-page .page-num b").text(num)

    //上一页
    $(".goods-pages-page .next-page").on("click",function(){
        num ++;
        if(num>=40){
            num = 40
        }
        console.log(num)
        $(".goods-pages-page .page-num b").text(num)
        start -= 40;
        end -=40;
        for(var i=start;i<end;i++){
            $(".good-list ul li").eq(i).show()  
        }
        for(var i=end;i<totalSize-1;i++){
            $(".good-list ul li").eq(i).hide()  
        }
    })

    //下一页
    $(".goods-pages-page .pre-page").on("click",function(){
        num --;
        if(num <=1){
            num = 1; 
        }
        console.log(num)
        $(".goods-pages-page .page-num b").text(num)
        start += 40;
        end += 40;
        for(var i=start;i<end;i++){
            $(".good-list ul li").eq(i).show()  
        }
        for(var i=end;i<totalSize-1;i++){
            $(".good-list ul li").eq(i).hide()  
        }
    })   
})