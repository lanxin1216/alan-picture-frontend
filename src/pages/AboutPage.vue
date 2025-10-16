<template>
  <div class="about">
    <!-- 标题部分 -->
    <a-row type="flex" justify="center" class="about-header">
      <a-col :xs="24" :md="20" :lg="16">
        <a-typography>
          <a-typography-title :level="1" class="main-title">屿图 · 关于我们</a-typography-title>
          <a-typography-paragraph class="subtitle">
            光影交织的岛屿，记忆停泊的港湾
          </a-typography-paragraph>
        </a-typography>
      </a-col>
    </a-row>

    <!-- 内容与作者信息整体布局 -->
    <a-row type="flex" justify="center" class="about-body">
      <a-col :xs="24" :lg="16">
        <a-card class="mission-card">
          <a-typography>
            <a-typography-paragraph class="intro-text">
              在浩瀚的数字海洋中，每一张图片都是一座孤岛，承载着独特的光影与故事。屿图，便是连接这些岛屿的桥梁，让每一份视觉记忆都能找到停泊的港湾。
            </a-typography-paragraph>
            <a-typography-paragraph class="intro-text">
              这里，时光被定格成诗，色彩流淌成河。我们相信，每一帧画面都不只是像素的堆砌，而是情感的容器，是记忆的坐标，是心灵与世界的对话。
            </a-typography-paragraph>
          </a-typography>

          <a-typography>
            <a-typography-title :level="2" class="section-title">初心如始</a-typography-title>
            <a-typography-paragraph class="mission-text">
              屿图的诞生，源于一个简单的愿望：为漂泊在数字世界的视觉记忆，建造一座温暖的岛屿。
            </a-typography-paragraph>
            <a-typography-paragraph class="mission-text">
              我们见过太多珍贵的照片沉睡在硬盘深处，太多动人的瞬间被遗忘在社交媒体的洪流中。于是我们想，是否可以为这些视觉故事创造一个专属的空间？让它们不再孤独，让每一道光影都能被看见、被珍惜。
            </a-typography-paragraph>
            <a-typography-paragraph class="mission-text">
              在这里，技术不是冰冷的功能堆砌，而是为美好服务的温柔工具。我们追求的不仅是高效的图片管理，更是情感的连接与共鸣。
            </a-typography-paragraph>
            <a-typography-paragraph class="mission-text highlight">
              屿图，不只是一个图库。<br />
              它是你视觉日记的守护者，是创意火花的培育者，是连接心与眼的诗意桥梁。
            </a-typography-paragraph>
            <a-typography-paragraph class="mission-text signature">
              <strong>
                让每一道光影，都有归处。<br />
                让每一个故事，都不被辜负。 </strong
              ><br />
              —— 屿图
            </a-typography-paragraph>
          </a-typography>

          <!-- 作者信息部分（移到最底部） -->
          <a-divider />
          <div class="author-line">
            👨‍💻 AlanK |
            <HomeOutlined />
            <a href="https://www.alank.top/" target="_blank" rel="noopener" class="author-link">
              主页
            </a>
            |
            <GlobalOutlined />
            <a href="https://www.alank.top/" target="_blank" rel="noopener" class="author-link">
              博客
            </a>
            |
            <GithubOutlined />
            <a
              href="https://github.com/lanxin1216"
              target="_blank"
              rel="noopener"
              class="author-link"
            >
              GitHub
            </a>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { HomeOutlined, GlobalOutlined, GithubOutlined } from '@ant-design/icons-vue'

export default {
  components: { HomeOutlined, GlobalOutlined, GithubOutlined },
}
</script>

<style scoped>
.about-header {
  text-align: center;
}

.main-title {
  color: #1890ff;
  font-weight: 300;
  margin-bottom: 10px !important;
}

.subtitle {
  font-size: 18px;
  color: #666;
  font-style: italic;
}

.mission-card {
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
  padding: 24px;
}

.mission-text,
.intro-text {
  font-size: 16px;
  line-height: 1.8;
  text-align: justify;
  margin-bottom: 16px;
}

.section-title {
  text-align: center;
  color: #1890ff;
  font-weight: 400;
  margin: 32px 0 16px;
}

.highlight {
  background-color: #f0f8ff;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #1890ff;
  font-size: 18px;
  text-align: center;
}

.signature {
  text-align: right;
  font-style: italic;
  color: #666;
}

/* 作者信息一行展示 */
.author-line {
  text-align: center;
  margin-top: 24px;
  font-size: 16px;
  color: #444;
}

.author-link {
  color: #1890ff;
  text-decoration: none;
  margin: 0 6px;
  font-weight: 500;
}

.author-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .mission-card {
    padding: 16px;
  }
}
</style>
