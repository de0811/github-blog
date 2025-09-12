#!/usr/bin/env node

/**
 * Giscus 설정을 위한 Repository ID와 Category ID를 가져오는 스크립트
 * 
 * 사용 방법:
 * 1. GitHub Personal Access Token 필요 (repo 권한)
 * 2. node get-giscus-ids.js
 */

const https = require('https');

// GitHub API 호출 함수
function makeGitHubRequest(path, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'GitHub-Blog-Setup',
        'Accept': 'application/vnd.github.v3+json',
        ...(token && { 'Authorization': `token ${token}` })
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// GraphQL 쿼리 실행
function makeGraphQLRequest(query, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });
    
    const options = {
      hostname: 'api.github.com',
      path: '/graphql',
      method: 'POST',
      headers: {
        'User-Agent': 'GitHub-Blog-Setup',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${token}`
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(responseData));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

async function getGiscusIds() {
  const owner = 'de0811';
  const repo = 'github-blog';
  
  console.log(`🔍 ${owner}/${repo} repository 정보를 가져오는 중...`);

  try {
    // Repository 정보 가져오기
    const repoInfo = await makeGitHubRequest(`/repos/${owner}/${repo}`);
    console.log(`📦 Repository ID: ${repoInfo.node_id}`);
    
    // Discussions 활성화 여부 확인
    if (!repoInfo.has_discussions) {
      console.log(`⚠️  Discussions가 활성화되지 않았습니다.`);
      console.log(`📖 DISCUSSIONS_SETUP.md 파일의 "1. GitHub Repository에서 Discussions 활성화" 섹션을 참고하세요.`);
      return;
    }

    console.log(`✅ Discussions가 활성화되어 있습니다.`);
    
    // 간단한 토큰 체크 (토큰 없이도 일부 정보는 가져올 수 있음)
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      console.log(`\n⚠️  더 자세한 정보를 위해서는 GitHub Personal Access Token이 필요합니다.`);
      console.log(`환경변수 GITHUB_TOKEN을 설정하거나, https://giscus.app 에서 직접 설정하세요.`);
      console.log(`\n📋 현재까지의 정보:`);
      console.log(`   Repository: ${owner}/${repo}`);
      console.log(`   Repository ID: ${repoInfo.node_id}`);
      return;
    }

    // Discussion categories 가져오기 (GraphQL 필요)
    const query = `
      query {
        repository(owner: "${owner}", name: "${repo}") {
          discussionCategories(first: 10) {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    `;

    const result = await makeGraphQLRequest(query, token);
    
    if (result.data && result.data.repository && result.data.repository.discussionCategories) {
      const categories = result.data.repository.discussionCategories.nodes;
      
      console.log(`\n📋 Discussion Categories:`);
      categories.forEach(cat => {
        console.log(`   ${cat.name} (${cat.slug}): ${cat.id}`);
      });

      // General 카테고리 찾기
      const generalCategory = categories.find(cat => 
        cat.slug === 'general' || cat.name.toLowerCase() === 'general'
      );

      if (generalCategory) {
        console.log(`\n✅ Comments 컴포넌트에 사용할 설정:`);
        console.log(`   data-repo="${owner}/${repo}"`);
        console.log(`   data-repo-id="${repoInfo.node_id}"`);
        console.log(`   data-category="${generalCategory.name}"`);
        console.log(`   data-category-id="${generalCategory.id}"`);
      } else {
        console.log(`\n⚠️  'General' 카테고리를 찾을 수 없습니다. 첫 번째 카테고리를 사용하세요:`);
        if (categories.length > 0) {
          console.log(`   data-category="${categories[0].name}"`);
          console.log(`   data-category-id="${categories[0].id}"`);
        }
      }

    } else {
      console.log(`\n❌ Discussion categories를 가져오는데 실패했습니다.`);
      console.log(`토큰에 적절한 권한이 있는지 확인하세요.`);
    }

  } catch (error) {
    console.error(`❌ 오류 발생:`, error.message);
    console.log(`\n💡 해결 방법:`);
    console.log(`1. Repository가 public인지 확인`);
    console.log(`2. Discussions가 활성화되었는지 확인`);
    console.log(`3. 토큰에 repo 권한이 있는지 확인`);
  }
}

// 스크립트 실행
if (require.main === module) {
  getGiscusIds().catch(console.error);
}

module.exports = { getGiscusIds };