const gulp = require("gulp")
const htmlmin = require("gulp-htmlmin")
const cssmin = require("gulp-clean-css")
const uglify = require("gulp-uglify")
const babel = require("gulp-babel")
const imagemin = require("gulp-imagemin")
const autoprefixer = require("gulp-autoprefixer") 

gulp.task("htmlmin",function(){
    gulp.src(["./src/*.html","./src/*.html"])
    .pipe(htmlmin({
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    }))
    .pipe(gulp.dest("./dest"))
})

gulp.task("cssmin",function(){
    gulp.src("./src/**/*.css")
    .pipe(cssmin())
    .pipe(gulp.dest("./dest/css"))
})

gulp.task("textAutoFx",function(){
    gulp.src('./src/**/*.css')
    .pipe(autoprefixer({
        browsers: ['last 2 versions', 'Android >= 4.0'],
        cascade: true, //是否美化属性值 默认：true 像这样：
        //-webkit-transform: rotate(45deg);
        //        transform: rotate(45deg);
        remove:true //是否去掉不必要的前缀 默认：true
    }))
    .pipe(gulp.dest('./dest/css'))
})

gulp.task("imagemin",function(){
    // （**匹配src/js的0个或多个子文件夹）
    gulp.src('./src/img/*.{png,jpg,gif,svg,jpeg}')
    .pipe(imagemin())
    .pipe(gulp.dest("./dest/images"))
})

gulp.task("jsmin",function(){
    gulp.src('./src/js/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('./dest/js'))
})

gulp.task("default",["htmlmin","cssmin","jsmin","textAutoFx"])