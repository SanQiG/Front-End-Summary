> 参考了这几篇文章
> 1. [GET和POST：辩证看100 continue，以及最根本区别](<https://github.com/amandakelake/blog/issues/20>)
> 2. [99%的人都理解错了HTTP中GET与POST的区别](<https://zhuanlan.zhihu.com/p/22536382>)
> 3. [听说『99% 的人都理解错了 HTTP 中 GET 与 POST 的区别』？？](<https://zhuanlan.zhihu.com/p/25028045>)

在看到[GET和POST：辩证看100 continue，以及最根本区别](<https://github.com/amandakelake/blog/issues/20>)这篇文章之前，我也刚好刚看完[99%的人都理解错了HTTP中GET与POST的区别](<https://zhuanlan.zhihu.com/p/22536382>)这篇文章，但是看完之后又让我更加深入地了解了GET和POST!!!

文章2得出了两个言简意赅的结论：

> GET产生一个TCP数据包；POST产生两个TCP数据包

> 对于GET方式的请求，浏览器会把http header和data一并发送出去，服务器响应200；对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok

文章3对文章2的结论提出了一些疑问，主要是关于首部`Expect: 100-continue`的区别。《HTTP权威指南》这样P62和附录C这样解释道

> 100 continue的目的是对**HTTP客户端应用程序有一个实体的主体部分要发送到服务器，但希望在发送之前查看一下服务器是否会接受这个实体**这种情况进行优化

客户端

> 如果客户端在向服务器发送一个实体，并愿意在发送实体之前等待100 continue响应，那么客户端就要发送一个携带了值为100 continue的Except请求首部。如果客户端没有发送实体，就不应该发送100 continue Except首部，因为这样会使服务器误以为客户端要发送一个实体

认真看这个地方，就会发现跟文章2中的区别，这里是客户端愿意发100 continue才会有响应，并不是每次都会有100 continue响应，再对比一下文章2的结论

> 对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok

**区别就在这里**

服务器端

> 如果服务器收到一条带有值为100 continue的Except首部的请求，它会用100 continue响应或一条错误码来进行响应。服务器永远也不应该向没有发送100 continue期望的客户端发送100 continue状态码。
> 如果服务器在有机会发送100 continue响应之前就收到了部分（或者全部）的实体，说明服务器已经打算继续发送数据了，这样服务器就不需要发送这个状态码了，但是服务器完成请求之后，还是应该为请求发送一个最终状态码。

文章3得出的结论是

> 通过抓包发现，尽管会分两次，body就是紧随在header后面发送的，根本不存在『等待服务器响应』这一说

***

这里是W3C的对比[HTTP 方法：GET 对比 POST](<http://www.w3school.com.cn/tags/html_ref_httpmethods.asp>)

![](https://user-images.githubusercontent.com/25027560/36575667-2034615c-1887-11e8-877e-69a548ea4b9d.png)

首先，GET和POST是由HTTP协议定义的，Method和Data（URL，Body，Header）这两个概念没有必然的联系，使用哪个Method与应用层的数据如何传输是没有相互关系的。

HTTP没有要求，如果是POST，数据就要放在BODY中。也没有要求GET，数据（参数）就一定要放在URL中而不能放在BODY中。

HTTP协议明确地指出了，HTTP头和Body都没有长度的要求，URL长度上的限制主要是由服务器或浏览器造成的。

**`在用法上，一个用于获取数据，一个用于修改数据`**
**`在根本上，二者并没有什么区别`**
**`在细节上，有一些区别，需要展开讲吗？`**

