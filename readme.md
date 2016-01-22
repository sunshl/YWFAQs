# 知识库维护

使用[FreeMind](http://freemind.sourceforge.net/wiki/index.php/Download)打开faqs.mm，更新知识库

**注意：**为了防止冲突，务必在更新前pull，更新faqs.mm后及时提交。


# 发布到线上

## 导出html

![image](http://img01.taobaocdn.com/top/i1/LB1zq0YJXXXXXcjapXXXXXXXXXX)

**注意：**选择`导出为XHTML格式(JavaScript版本)...`，并导出到`output`目录

## 还原faq.html_files目录

因为导出时也会更新`faq.html_files`目录，但这个目录中内容以git库中已有内容为准，所以请调用`git checkout -- output/faq.html_files`恢复掉。（因为只需要更新`faqs.html`即可）。

## 提交到github