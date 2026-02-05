---
title: 什么是YAML Front Matter
date: 2026-02-04 11:30:00 +0800
author: glitter
categories: [技术]
tags: [YAML]
layout: post
keywords: [YAML, blog]
bg_image: /assets/img/camera.PNG
---
### 一句话理解
> YAML Front Matter = 写在文件开头的“配置说明书”
{: .prompt-tip }

### 基本格式
用三个短横线`---`包起来👇
```yaml
---
title: 我的第一篇博客
date: 2026-02-04
author: 
  name: glitter
  email: guangzhi.ys@gmail.com
tags:
  - 技术
  - 前端
published: true
---
```

行内列表: 
```
tags: [start, blog]
```

分行列表: 
```
tags:
  - start
  - blog
```

嵌套对象
```
author: 
  name: Glitter
  email: guangzhi.ys@gmail.com
```

### YAML Front Matter 通常用来干嘛？
1️⃣ 描述文章信息（最常见）
```yaml
title: 什么是SEO
description: 一篇讲清楚SEO基础的文章.    # 副标题
date: 2026-01-29
```

2️⃣ 控制页面行为
```yaml
draft: true        # 草稿，不发布
published: false   # 不生成页面
layout: post       # 使用的模板，具体查看_layouts里面的内容
```

3️⃣ 分类、标签、导航
```yaml
categories:
  - 技术
tags:
  - Git
  - Blog
```

4️⃣ SEO / 社交分享
```yaml
keywords: [SEO, 搜索引擎优化]   # 用于seo搜索
```

5️⃣ 置顶&功能开关
```yaml
pin: true   # 置顶文章，在首页永远排在最前面
math: true   # 启用数学公式渲染，支持LaTeX
mermaid: true   # 启用mermaid图表
```

6️⃣ 文章头图
```yaml
image:
    path: /your/img/path.png    # 文章封面图，会显示在文章顶部、卡片中
    alt: xxxxxx    # 图片的alt文本，用于seo和无障碍阅读
```