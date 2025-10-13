<template>
  <div class="about min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100 py-12 px-4">
    <!-- 头部标题 -->
    <div class="text-center mb-12">
      <div class="glass-container inline-block p-8 rounded-2xl shadow-xl">
        <h1 class="main-title text-4xl font-bold bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent mb-4">
          屿图 · 关于我们
        </h1>
        <p class="subtitle text-xl text-text-secondary font-light">
          光影交织的岛屿，记忆停泊的港湾
        </p>
      </div>
    </div>

    <!-- 介绍内容 -->
    <div class="max-w-4xl mx-auto mb-12">
      <div class="glass-container p-8 rounded-2xl shadow-xl">
        <div class="text-center space-y-6">
          <p class="intro-text text-lg text-text-primary leading-relaxed">
            在浩瀚的数字海洋中，每一张图片都是一座孤岛，承载着独特的光影与故事。屿图，便是连接这些岛屿的桥梁，让每一份视觉记忆都能找到停泊的港湾。
          </p>
          <p class="intro-text text-lg text-text-primary leading-relaxed">
            这里，时光被定格成诗，色彩流淌成河。我们相信，每一帧画面都不只是像素的堆砌，而是情感的容器，是记忆的坐标，是心灵与世界的对话。
          </p>
        </div>
      </div>
    </div>

    <!-- 使命宣言 -->
    <div class="max-w-4xl mx-auto">
      <div class="glass-container p-8 rounded-2xl shadow-xl">
        <div class="text-center mb-8">
          <h2 class="section-title text-2xl font-bold bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent">
            初心如始
          </h2>
        </div>
        
        <div class="space-y-6">
          <p class="mission-text text-base text-text-primary leading-relaxed">
            屿图的诞生，源于一个简单的愿望：为漂泊在数字世界的视觉记忆，建造一座温暖的岛屿。
          </p>
          <p class="mission-text text-base text-text-primary leading-relaxed">
            我们见过太多珍贵的照片沉睡在硬盘深处，太多动人的瞬间被遗忘在社交媒体的洪流中。于是我们想，是否可以为这些视觉故事创造一个专属的空间？让它们不再孤独，让每一道光影都能被看见、被珍惜。
          </p>
          <p class="mission-text text-base text-text-primary leading-relaxed">
            在这里，技术不是冰冷的功能堆砌，而是为美好服务的温柔工具。我们追求的不仅是高效的图片管理，更是情感的连接与共鸣。
          </p>
          <div class="highlight bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-l-4 border-primary-blue">
            <p class="mission-text text-lg text-text-primary leading-relaxed font-medium text-center">
              屿图，不只是一个图库。<br>
              它是你视觉日记的守护者，是创意火花的培育者，是连接心与眼的诗意桥梁。
            </p>
          </div>
          <div class="signature text-right">
            <p class="mission-text text-base text-text-secondary italic">
              <strong class="text-text-primary">让每一道光影，都有归处。<br>
                让每一个故事，都不被辜负。</strong><br>
              —— 屿图团队
            </p>
          </div>
        </div>
      </div>
    </div>
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
}

.glass-container {
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
}

.main-title {
  font-weight: 700;
  margin-bottom: 0;
}

.subtitle {
  font-size: 20px;
  font-style: italic;
}

.intro-text {
  font-size: 18px;
  line-height: 1.8;
  text-align: center;
}

.section-title {
  font-weight: 600;
  margin-bottom: 0;
}

.mission-text {
  font-size: 16px;
  line-height: 1.8;
  text-align: justify;
}

.highlight {
  padding: 24px;
  border-radius: 12px;
  border-left: 4px solid var(--primary-blue);
  font-size: 18px;
  line-height: 1.6;
  text-align: center;
}

.signature {
  text-align: right;
  font-style: italic;
  margin-top: 24px;
}

/* 响应式设计 */
@media (min-width: 1024px) {
  .about {
    padding: 80px 40px;
  }
  
  .main-title {
    font-size: 48px;
  }
  
  .subtitle {
    font-size: 24px;
  }
  
  .intro-text {
    font-size: 20px;
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .mission-text {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .about {
    padding: 40px 16px;
  }
  
  .glass-container {
    padding: 24px !important;
  }
  
  .main-title {
    font-size: 32px;
  }
  
  .subtitle {
    font-size: 18px;
  }
  
  .intro-text {
    font-size: 16px;
    text-align: justify;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .mission-text {
    font-size: 15px;
  }
  
  .highlight {
    padding: 16px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .about {
    padding: 24px 12px;
  }
  
  .glass-container {
    padding: 20px !important;
  }
  
  .main-title {
    font-size: 28px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .intro-text {
    font-size: 15px;
  }
  
  .mission-text {
    font-size: 14px;
  }
  
  .highlight {
    padding: 12px;
    font-size: 15px;
  }
}
</style>
