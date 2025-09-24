<template>
  <div class="about">
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

    <a-row type="flex" justify="center" class="about-content">
      <a-col :xs="24" :md="20" :lg="16">
        <a-card class="intro-card">
          <a-typography>
            <a-typography-paragraph class="intro-text">
              在浩瀚的数字海洋中，每一张图片都是一座孤岛，承载着独特的光影与故事。屿图，便是连接这些岛屿的桥梁，让每一份视觉记忆都能找到停泊的港湾。
            </a-typography-paragraph>
            <a-typography-paragraph class="intro-text">
              这里，时光被定格成诗，色彩流淌成河。我们相信，每一帧画面都不只是像素的堆砌，而是情感的容器，是记忆的坐标，是心灵与世界的对话。
            </a-typography-paragraph>
          </a-typography>
        </a-card>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center" class="mission-section">
      <a-col :xs="24" :md="20" :lg="16">
        <a-card class="mission-card">
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
              屿图，不只是一个图库。<br>
              它是你视觉日记的守护者，是创意火花的培育者，是连接心与眼的诗意桥梁。
            </a-typography-paragraph>
            <a-typography-paragraph class="mission-text signature">
              <strong>让每一道光影，都有归处。<br>
                让每一个故事，都不被辜负。</strong><br>
              —— 屿图团队
            </a-typography-paragraph>
          </a-typography>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutPage',
  setup() {
    const features = [
      {
        title: '智能图库管理',
        description: '像整理书架一样整理你的视觉记忆，智能分类、标签系统让海量图片井然有序。',
        icon: 'fas fa-th-large'
      },
      {
        title: '团队协作空间',
        description: '与志同道合的伙伴共建视觉项目，让创意在共享中绽放更耀眼的光芒。',
        icon: 'fas fa-users'
      },
      {
        title: '精美展示平台',
        description: '你的作品值得被温柔以待，我们提供优雅的展示方式，让每张图片都焕发独特魅力。',
        icon: 'fas fa-palette'
      },
      {
        title: '安全云存储',
        description: '珍贵的记忆需要妥善保管，多重备份与加密技术守护你的每一份创作。',
        icon: 'fas fa-shield-alt'
      },
      {
        title: '灵感社区',
        description: '发现来自世界各地的视觉故事，在欣赏与交流中激发新的创作火花。',
        icon: 'fas fa-lightbulb'
      },
      {
        title: '无缝分享',
        description: '一键分享美好瞬间到各大平台，让精彩内容轻松触达更多观众。',
        icon: 'fas fa-share-alt'
      }
    ]

    return {
      features
    }
  }
})
</script>

<style scoped>
.about {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

.about-header {
  text-align: center;
  margin-bottom: 40px;
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

.about-content {
  margin-bottom: 50px;
}

.intro-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
}

.intro-text {
  font-size: 16px;
  line-height: 1.8;
  text-align: justify;
  margin-bottom: 16px;
}

.features-section {
  margin-bottom: 50px;
}

.section-title {
  text-align: center;
  color: #1890ff;
  margin-bottom: 30px !important;
  font-weight: 300;
}

.feature-card {
  text-align: center;
  height: 100%;
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px 12px 0 0;
}

.feature-icon i {
  font-size: 32px;
  color: white;
}

.mission-section {
  margin-bottom: 30px;
}

.mission-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
}

.mission-text {
  font-size: 16px;
  line-height: 1.8;
  text-align: justify;
  margin-bottom: 20px;
}

.highlight {
  background-color: #f0f8ff;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #1890ff;
  font-size: 18px;
  line-height: 1.6;
  text-align: center;
}

.signature {
  text-align: right;
  font-style: italic;
  color: #666;
  margin-top: 30px;
}

@media (min-width: 1024px) {
  .about {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 40px;
  }

  .about-header, .about-content, .features-section, .mission-section {
    margin-bottom: 60px;
  }
}

@media (max-width: 768px) {
  .about {
    padding: 20px 15px;
  }

  .main-title {
    font-size: 24px !important;
  }

  .subtitle {
    font-size: 16px;
  }

  .intro-text, .mission-text {
    font-size: 14px;
  }
}
</style>
