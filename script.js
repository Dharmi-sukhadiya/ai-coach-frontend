/**
 * AI Resume + Interview Coach - Main Script
 * Handles custom animations, typing effects, interactive modes, and user actions.
 */


document.addEventListener('DOMContentLoaded', () => {
  
  async function analyzeResumeWithAI(resumeText, targetRole) {
  try {
    const response = await fetch('${import.meta.env.VITE_API_URL}/api/analyze-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        resumeText,
        targetRole
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Analysis failed');
    }

    analyzerLoader.classList.add('hidden');
    resultCard.classList.remove('hidden');

    renderAIResults(data);

  } catch (error) {
    analyzerLoader.classList.add('hidden');

    alert(error.message || 'Resume analysis failed.');

    console.error(error);
  }
}

function renderAIResults(data) {

  let score = 0;

  resultAtsScore.textContent = '0';

  const interval = setInterval(() => {

    score += 2;

    if (score >= data.atsScore) {

      score = data.atsScore;

      clearInterval(interval);
    }

    resultAtsScore.textContent = score;

  }, 20);

  resultMatchStatus.textContent =
    `${data.profession} Resume Analysis`;

  resultMissingSkills.innerHTML = '';

  data.missingSkills.forEach(skill => {

    const pill = document.createElement('span');

    pill.className =
      'px-3 py-1 bg-white/[0.04] text-xs font-semibold rounded-full border border-white/[0.08]';

    pill.textContent = skill;

    resultMissingSkills.appendChild(pill);
  });

  resultImprovementsList.innerHTML = '';

  data.improvements.forEach(item => {

    const li = document.createElement('li');

    li.textContent = item;

    resultImprovementsList.appendChild(li);
  });

  resultFormattingList.innerHTML = '';

  data.formatting.forEach(item => {

    const li = document.createElement('li');

    li.textContent = item;

    resultFormattingList.appendChild(li);
  });
}
  // Navigation & Scroll to main features list
  const ctaBtn = document.getElementById('cta-btn');
  const featuresSection = document.getElementById('features-section');

  if (ctaBtn && featuresSection) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Highlight the features list slightly
      featuresSection.classList.add('ring-2', 'ring-purple-500/20');
      setTimeout(() => {
        featuresSection.classList.remove('ring-2', 'ring-purple-500/20');
      }, 1500);
    });
  }

  // Feature list grid cards (Elite Capabilities section redirect targets)
  const scrollFeatureCards = document.querySelectorAll('[data-scroll-target]');
  scrollFeatureCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.getAttribute('data-scroll-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Add highlight transition effect to emphasize the target section loaded
        targetEl.classList.add('ring-2', 'ring-purple-500/20', 'duration-500');
        setTimeout(() => {
          targetEl.classList.remove('ring-2', 'ring-purple-500/20');
        }, 1500);
      }
    });
  });

  // --- ATS Resume Analyzer Logic ---
  const analyzerTextarea = document.getElementById('analyzer-textarea');
  const analyzeBtn = document.getElementById('analyze-resume-btn');
  const idleState = document.getElementById('analyzer-idle-state');
  const analyzerLoader = document.getElementById('analyzer-loader');
  const loaderStepText = document.getElementById('analyzer-loader-step');
  const resultCard = document.getElementById('analyzer-result-card');

  const resultAtsScore = document.getElementById('result-ats-score');
  const resultMatchStatus = document.getElementById('result-match-status');
  const resultMissingSkills = document.getElementById('result-missing-skills');
  const resultImprovementsList = document.getElementById('result-improvements-list');
  const resultFormattingList = document.getElementById('result-formatting-list');

  // Realistic raw resume template to prefill
  const SAMPLE_CV = `ALEX MERCER - SOFTWARE DEVELOPER
Email: alex@example.com | GitHub: github.com/alex | Phone: (555) 019-2831

Summary:
Developer with experience building web things, looking for a cool company to join. Hard worker, team builder, fast learner.

Work Experience:
Software Engineer at Acme Corp (2024 - Present)
- Worked on the frontend using HTML, CSS and some JavaScript.
- Helped make the page load faster by deleting some heavy images.
- Discussed specifications with other developers.
- Fixed some client reported bugs.

Junior Developer at WebFlow Solutions (2022 - 2024)
- Built interactive parts of websites.
- Talked to customers about specifications.
- Monitored backup servers.

Skills: Web dev, CSS, HTML, JavaScript, Git, Team Player.`;

  if (analyzerTextarea) {
    analyzerTextarea.value = SAMPLE_CV;
  }

  // Pre-configured custom response data depending on the keywords
  
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      const textVal = analyzerTextarea.value.trim();
      const titleVal = document.getElementById('analyzer-job-title').value.trim();

      if (!textVal) {
        alert("Please paste your raw resume text first to parse.");
        return;
      }

      // Hide idle / result state and show loader
      idleState.classList.add('hidden');
      resultCard.classList.add('hidden');
      analyzerLoader.classList.remove('hidden');

      // Smooth step-by-step telemetry simulator
      const steps = [
        "Parsing Document Layout Hierarchy...",
        "Evaluating Keyword Matches Against Global ATS Indices...",
        "Correlating Target Domain & Industry Context...",
        "Generating Actionable Formatting & Metric Guidelines..."
      ];

      let currentStepIdx = 0;
      loaderStepText.textContent = steps[0];

      const stepInterval = setInterval(() => {
        currentStepIdx++;
        if (currentStepIdx < steps.length) {
          loaderStepText.textContent = steps[currentStepIdx];
        } else {
          clearInterval(stepInterval);
          analyzeResumeWithAI(textVal, titleVal);
        }
      }, 500);
    });
  }

 

  // --- Premium LinkedIn Headline Generator Logic ---
  const headlineRoleInput = document.getElementById('headline-role-input');
  const headlineSkillsInput = document.getElementById('headline-skills-input');
  const generateHeadlinesBtn = document.getElementById('generate-headlines-btn');
  const headlineIdleState = document.getElementById('headline-idle-state');
  const headlineLoader = document.getElementById('headline-loader');
  const headlineStepText = document.getElementById('headline-loader-step');
  const headlineResultsContainer = document.getElementById('headline-results-container');
  const headlineCardsContainer = document.getElementById('headline-cards');
  const accentBtns = document.querySelectorAll('.headline-accent-btn');

  let activeAccent = 'highimpact';

  // Toggle active accent buttons
  accentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      accentBtns.forEach(b => {
        b.classList.remove('bg-purple-500/10', 'border-purple-500/40', 'text-purple-300');
        b.classList.add('bg-white/[0.01]', 'border-white/[0.08]', 'text-gray-400');
      });

      btn.classList.remove('bg-white/[0.01]', 'border-white/[0.08]', 'text-gray-400');
      btn.classList.add('bg-purple-500/10', 'border-purple-500/40', 'text-purple-300');

      if (btn.id === 'accent-highimpact') activeAccent = 'highimpact';
      else if (btn.id === 'accent-growth') activeAccent = 'growth';
      else if (btn.id === 'accent-creative') activeAccent = 'creative';
    });
  });

  if (generateHeadlinesBtn) {
    generateHeadlinesBtn.addEventListener('click', () => {
      const role = headlineRoleInput.value.trim();
      const skillsRaw = headlineSkillsInput.value.trim();

      if (!role) {
        alert("Please enter a target professional role (e.g. Frontend Engineer).");
        return;
      }

      const skills = skillsRaw
        ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      // Show loader
      headlineIdleState.classList.add('hidden');
      headlineResultsContainer.classList.add('hidden');
      headlineLoader.classList.remove('hidden');

      const builderSteps = [
        "Analyzing search frequency indices...",
        "Applying semantic title alignment...",
        "Formulating recruiter hook accents..."
      ];

      let stepIdx = 0;
      headlineStepText.textContent = builderSteps[0];

      const intervalId = setInterval(() => {
        stepIdx++;
        if (stepIdx < builderSteps.length) {
          headlineStepText.textContent = builderSteps[stepIdx];
        } else {
          clearInterval(intervalId);
          renderGeneratedHeadlines(role, skills);
        }
      }, 400);
    });
  }

  function buildFallbackHeadlines(role, skills) {
    const focus = skills[0] || 'team leadership';
    const secondary = skills[1] || 'stakeholder communication';
    const tertiary = skills[2] || 'business outcomes';

    if (activeAccent === 'growth') {
      return [
        `${role} | Improving team alignment, delivery quality, and measurable ${tertiary}`,
        `${role} | Driving clearer communication, stronger execution, and KPI-focused outcomes`,
        `${role} | Helping teams turn priorities into consistent delivery through ${focus}`
      ];
    }

    if (activeAccent === 'creative') {
      return [
        `${role} | Building collaborative teams through ${focus} and practical execution`,
        `${role} | Connecting people, process, and priorities with clear ${secondary}`,
        `${role} | Creating calm, high-trust teams focused on ownership and outcomes`
      ];
    }

    return [
      `${role} | Specialized in ${focus} and ${secondary} | Driving team performance and business outcomes`,
      `${role} | Leading cross-functional execution through clear communication and operational focus`,
      `${role} | People-first leader focused on collaboration, accountability, and measurable results`
    ];
  }

  function renderHeadlineCards(templates) {
    headlineCardsContainer.innerHTML = '';
    
    templates.forEach((headline, index) => {
      const card = document.createElement('div');
      card.className = 'glass-panel p-4 rounded-xl flex items-start justify-between gap-4 border border-white/[0.04] hover:bg-white/[0.03] transition duration-200';
      
      card.innerHTML = `
        <div class="flex-1">
          <span class="font-mono text-[9px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">Option 0${index + 1}</span>
          <p class="text-sm font-medium text-gray-200 leading-relaxed">${escapeHtml(headline)}</p>
        </div>
        <button class="copy-headline-btn flex items-center justify-center p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-purple-500/10 hover:border-purple-500/20 text-gray-400 hover:text-purple-300 transition duration-300 cursor-pointer" title="Copy to clipboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
        </button>
      `;

      const copyBtn = card.querySelector('.copy-headline-btn');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(headline).then(() => {
          copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          `;
          copyBtn.classList.add('bg-emerald-500/10', 'border-emerald-500/20');
          
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
            `;
            copyBtn.classList.remove('bg-emerald-500/10', 'border-emerald-500/20');
          }, 2000);
        });
      });

      headlineCardsContainer.appendChild(card);
    });
  }

  async function renderGeneratedHeadlines(role, skills) {
    headlineLoader.classList.add('hidden');
    headlineResultsContainer.classList.remove('hidden');
    headlineResultsContainer.classList.add('animate-fadeIn');

    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/headlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          skills,
          accent: activeAccent
        })
      });

      const data = await response.json();

      if (!response.ok || !Array.isArray(data.headlines)) {
        throw new Error(data.error || 'Could not generate headlines.');
      }

      renderHeadlineCards(data.headlines.slice(0, 3));
    } catch (error) {
      renderHeadlineCards(buildFallbackHeadlines(role, skills));
    }

    return;

    // Define headlines based on active accent selection
    let templates = [];
    
    if (activeAccent === 'highimpact') {
      templates = [
        `${role} | Specialized in ${skills[0]} & ${skills[1]} | Driving Scalable Technical Architectures & Agile Quality Excellence`,
        `${role} • Focusing on high-performance Client Systems using ${skills[0]}, ${skills[1]} & ${skills[2]}`,
        `${role} | Builder of Interactive & Enterprise-Grade Products | Expert in ${skills[0]} & Modern Web Solutions`
      ];
    } else if (activeAccent === 'growth') {
      templates = [
        `${role} | Engineered 35% faster page load times using ${skills[0]} & targeted lazy-loading models`,
        `${role} | Saved 15+ weekly team-hours by refactoring core legacy codebase with modern ${skills[1]}`,
        `${role} • Scaled consumer application backend with ${skills[2]} to successfully handle 120K+ active daily requests`
      ];
    } else { // creative
      templates = [
        `✨ ${role} | Developing the future of interactive cloud platforms using ${skills[0]} & ${skills[1]}`,
        `🚀 ${role} | Bridging clean backend algorithms with pleasant client designs using ${skills[0]} • ${skills[2]}`,
        `💡 Code Architect & Tech Advocate focused on inclusive developer experiences with ${skills[0]} and ${skills[1]}`
      ];
    }

    // Load templates into output list
    headlineCardsContainer.innerHTML = '';
    
    templates.forEach((headline, index) => {
      const card = document.createElement('div');
      card.className = 'glass-panel p-4 rounded-xl flex items-start justify-between gap-4 border border-white/[0.04] hover:bg-white/[0.03] transition duration-200';
      
      card.innerHTML = `
        <div class="flex-1">
          <span class="font-mono text-[9px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">Option 0${index + 1}</span>
          <p class="text-sm font-medium text-gray-200 leading-relaxed">${headline}</p>
        </div>
        <button class="copy-headline-btn flex items-center justify-center p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-purple-500/10 hover:border-purple-500/20 text-gray-400 hover:text-purple-300 transition duration-300 cursor-pointer" title="Copy to clipboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
        </button>
      `;

      // Copy click handler
      const copyBtn = card.querySelector('.copy-headline-btn');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(headline).then(() => {
          // Visual feedback
          copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          `;
          copyBtn.classList.add('bg-emerald-500/10', 'border-emerald-500/20');
          
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
            `;
            copyBtn.classList.remove('bg-emerald-500/10', 'border-emerald-500/20');
          }, 2000);
        });
      });

      headlineCardsContainer.appendChild(card);
    });
  }

  // --- Real-Time Interview Question Generator Logic ---
  const roleInput = document.getElementById('role');
const difficultySelect = document.getElementById('difficulty');
const generateQuestionsBtn = document.getElementById('generate-questions-btn');

const interviewIdleState = document.getElementById('interview-idle-state');
const interviewLoader = document.getElementById('interview-loader');
const interviewResultsContainer = document.getElementById('interview-results-container');

const interviewCards = document.getElementById('interview-cards');
const interviewRoleBadge =document.getElementById('interview-results-role-badge');

const interviewDiffBadge =document.getElementById('interview-results-diff-badge');


 async function generateQuestions(role, difficulty) {

  const response = await fetch('${import.meta.env.VITE_API_URL}/api/interview-questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      role,
      difficulty
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate questions');
  }

  displayQuestions(data);

}

function displayQuestions(data) {

  interviewCards.innerHTML = '';

  interviewRoleBadge.innerHTML = `
    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
    ${data.role} Questions
  `;

  interviewDiffBadge.textContent =
    data.difficulty.toUpperCase();

  data.questions.forEach((item, index) => {

    const card = document.createElement('div');

    card.className =
      'glass-panel p-4 rounded-xl border border-white/[0.05]';

    card.innerHTML = `
      <h4 class="font-bold text-white mb-2">
        Question ${index + 1}
      </h4>

      <p class="text-gray-300 mb-3">
        ${item.question}
      </p>

      <div class="text-sm text-emerald-300">
        <strong>Sample Answer:</strong>
        ${item.answer}
      </div>
    `;

    interviewCards.appendChild(card);

  });

}
  


generateQuestionsBtn.addEventListener('click', async () => {

  const role = roleInput.value.trim();
  const difficulty = difficultySelect.value;

  if (!role) {
    alert('Please enter a profession');
    return;
  }

  interviewIdleState.classList.add('hidden');
  interviewResultsContainer.classList.add('hidden');
  interviewLoader.classList.remove('hidden');

  try {

    await generateQuestions(role, difficulty);

    interviewLoader.classList.add('hidden');
    interviewResultsContainer.classList.remove('hidden');

  } catch (error) {

    interviewLoader.classList.add('hidden');

    alert(error.message);

    console.error(error);

  }

});

  

  
  // --- Mock Interview Chatbot Logic ---
  const chatbotPersonaSelect = document.getElementById('chatbot-persona-select');
  const personaDisplayName = document.getElementById('persona-display-name');
  const personaDisplayDesc = document.getElementById('persona-display-desc');
  const chatHeaderPersonaName = document.getElementById('chat-header-persona-name');
  const chatMessagesArea = document.getElementById('chat-messages-area');
  const chatTypingIndicator = document.getElementById('chat-typing-indicator');
  const chatInputText = document.getElementById('chat-input-text');
  const chatForm = document.getElementById('chat-form');
  const resetChatBtn = document.getElementById('reset-chat-btn');
  const chatStarterBtns = document.querySelectorAll('.chat-starter-btn');

  // Configured Persona details
  const PERSONA_PROFILES = {
    tough: {
      name: "Sarah - Tough Tech Lead",
      short: "Sarah (Amazon Tech Lead)",
      desc: "Focuses strictly on architectural scaling bounds, operational metrics, edge cases, and structural logic. Expect tough follow-ups!",
      accent: "AGGRESSION: HIGH | EVALUATION: OBJECTIVE",
      initialMsg: "Welcome to your mock interview session! I'm Sarah, a Principal Engineer. Let's make this highly effective. Tell me about a time you had to deliver a system when your requirements were highly ambiguous."
    },
    empathetic: {
      name: "Marcus - Empathetic Recruiter",
      short: "Marcus (Stripe Recruiter)",
      desc: "Warm and encouraging. Evaluates cultural fits, collaboration, STAR method storytelling, and leadership growth behaviors.",
      accent: "EMPATHY: MAXIMUM | FOCUS: LEADERSHIP & CULTURE",
      initialMsg: "Hi there! I'm Marcus, the recruiting lead here. My goal is to hear your story, understand your culture alignment, and help you shine. What's a product or challenge you worked on that you are most proud of?"
    },
    system: {
      name: "Elena - Systems Architect",
      short: "Elena (Systems Oracle)",
      desc: "Evaluates high-level structural patterns, distributed services, databases, caching layers, and fault tolerance strategies.",
      accent: "STABILITY: ABSOLUTE | FOCUS: HIGH AVAILABILITY",
      initialMsg: "Hello! I'm Elena, and we will focus on systemic trade-offs, scalability, and network architectures. How would you design a rate limiter that supports millions of requests per minute across multiple regions?"
    }
  };

  // Conversational response presets (Simulated dynamic responses based on patterns)
  const RESPONSE_FEEDBACK_ENGINE = {
    tough: [
      {
        well: "You clearly formulated the basic context and mentioned toolsets.",
        missing: "You skipped performance telemetry, SLA parameters, or precise numbers on exactly how much you scaled the system.",
        followUp: "Understood. But how did you determine that boundary? If your system suddenly saw a 10x spike on the gateway, what failover metric would trip first? Let's trace the storage bottleneck."
      },
      {
        well: "Good usage of structural hierarchy to break down your responsibilities.",
        missing: "You focused too much on team management instead of your single personal technical contribution.",
        followUp: "I want to drill into that. When the code was deployed and failed in sandbox, how did you analyze the production log stacks to find the root memory leak? Walk me through the telemetry."
      }
    ],
    empathetic: [
      {
        well: "Your enthusiasm shines! Explaining your personal motivation really grounds your story well.",
        missing: "Ensure you clearly split your STAR method. Specify the exact 'Result' metric that proved your system was highly successful.",
        followUp: "That is wonderfully collaborative! How did your teammates react to your new solution, and what did you learn about their work styles during that project?"
      },
      {
        well: "Great explanation of how you handled a team conflict elegantly.",
        missing: "Don't forget to highlight how you supported an inclusive, feedback-rich environment afterwards.",
        followUp: "Excellent outcome. If you had to mentor a junior dev going through that today, what would be the single advice you'd share with them based on this experience?"
      }
    ],
    system: [
      {
        well: "Excellent usage of database layering concepts to prevent network contention.",
        missing: "You need to account for eventual consistency limits or Redis cache serialization delays on cold-starts.",
        followUp: "Good blueprint. If the regional load balancer fails completely, how do you handle localized read replica synchronization? Which CAP theorem attributes did you choose?"
      },
      {
        well: "Thoughtful approach on vertical scaling versus clustering your service nodes.",
        missing: "You didn't outline single-point-of-failure (SPOF) risks in your high-availability gateway.",
        followUp: "Solid start. Let's look closer at your message queue system. If RabbitMQ buffers fill up, how blocks are dropped or backed off gracefully?"
      }
    ]
  };

  let responseIndex = { tough: 0, empathetic: 0, system: 0 };
  let chatHistory = [];

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }

  function appendCoachResponse(feedback, isError = false) {
    const aiResponse = document.createElement('div');
    aiResponse.className = 'flex items-start gap-3 max-w-[85%] animate-fadeIn';
    
    aiResponse.innerHTML = `
      <div class="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold text-amber-300 shrink-0">AI</div>
      <div class="space-y-3.5 flex-1">
        <div class="p-4 bg-white/[0.03]/80 border border-white/[0.05] rounded-r-2xl rounded-bl-2xl text-xs sm:text-sm text-gray-200 leading-relaxed shadow-sm space-y-2">
          <div class="flex items-center gap-1.5 text-xs ${isError ? 'text-rose-300' : 'text-amber-300'} font-mono">
            <span>${isError ? 'AI COACH OFFLINE' : 'COGNITIVE COACH REPORT'}</span>
          </div>
          
          <div class="space-y-1.5 pt-1 text-[11px] sm:text-xs">
            <p><strong class="text-emerald-400">WHAT SHINES:</strong> ${escapeHtml(feedback.well)}</p>
            <p><strong class="text-amber-400">ATS / INTERVIEW GAPS:</strong> ${escapeHtml(feedback.missing)}</p>
          </div>

          <div class="pt-2 border-t border-white/[0.05] text-xs font-medium text-gray-300 leading-relaxed">
            ${escapeHtml(feedback.followUp)}
          </div>
        </div>
      </div>
    `;

    chatMessagesArea.appendChild(aiResponse);
    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
  }

  // Set initial persona on load
  function resetChat(personaKey = 'tough') {
    const profile = PERSONA_PROFILES[personaKey];
    personaDisplayName.textContent = profile.name;
    personaDisplayDesc.textContent = profile.desc;
    chatHeaderPersonaName.textContent = profile.short;
    chatHistory = [{ role: 'assistant', text: profile.initialMsg }];

    // Clear and add welcome message
    chatMessagesArea.innerHTML = `
      <div class="flex items-start gap-3 max-w-[85%] animate-fadeIn">
        <div class="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold text-amber-300 shrink-0">AI</div>
        <div class="p-3.5 bg-white/[0.03] border border-white/[0.05] rounded-r-2xl rounded-bl-2xl text-xs sm:text-sm text-gray-200 leading-relaxed shadow-sm">
          ${escapeHtml(profile.initialMsg)}
        </div>
      </div>
    `;

    chatMessagesArea.scrollTop = 0;
  }

  if (chatbotPersonaSelect) {
    chatbotPersonaSelect.addEventListener('change', (e) => {
      resetChat(e.target.value);
    });
  }

  if (resetChatBtn) {
    resetChatBtn.addEventListener('click', () => {
      const activeVal = chatbotPersonaSelect ? chatbotPersonaSelect.value : 'tough';
      resetChat(activeVal);
    });
  }

  // Handle suggested starters clicks
  chatStarterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const rawText = btn.textContent.replace(/"/g, '').trim();
      if (chatInputText) {
        chatInputText.value = rawText;
        chatInputText.focus();
      }
    });
  });

  // Handle message sending
  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const userMessage = chatInputText.value.trim();
      if (!userMessage) return;

      // Disable inputs during typing delay
      chatInputText.value = '';
      chatInputText.disabled = true;
      
      // Add User response bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'flex items-start justify-end gap-3 max-w-[85%] ml-auto animate-fadeIn';
      userBubble.innerHTML = `
        <div class="p-3.5 bg-purple-600/15 border border-purple-500/30 rounded-l-2xl rounded-tr-2xl text-xs sm:text-sm text-gray-100 leading-relaxed shadow-sm">
          ${escapeHtml(userMessage)}
        </div>
        <div class="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[10px] font-bold text-purple-300 shrink-0">ME</div>
      `;
      chatMessagesArea.appendChild(userBubble);
      chatHistory.push({ role: 'user', text: userMessage });
      
      // Auto scroll
      chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;

      // Display typing indicator
      chatTypingIndicator.classList.remove('hidden');

      const currentPersonaId = chatbotPersonaSelect ? chatbotPersonaSelect.value : 'tough';
      let feedback;

      try {
        const response = await fetch('${import.meta.env.VITE_API_URL}/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            persona: currentPersonaId,
            message: userMessage,
            history: chatHistory
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'The AI coach could not answer.');
        }

        feedback = {
          well: data.well,
          missing: data.missing,
          followUp: data.followUp
        };
      } catch (error) {
        feedback = {
          well: 'Your message was received, but the live AI service did not return a response.',
          missing: error.message || 'Check that your Gemini API key is added in the project environment.',
          followUp: 'After adding the API key, try this same answer again and I will give situation-specific feedback.'
        };
      }

      setTimeout(() => {
        chatTypingIndicator.classList.add('hidden');
        appendCoachResponse(feedback);
        chatHistory.push({
          role: 'assistant',
          text: `What shines: ${feedback.well}\nGap: ${feedback.missing}\nFollow-up: ${feedback.followUp}`
        });
        chatInputText.disabled = false;
        chatInputText.focus();
        return;

        // Hide indicator
        chatTypingIndicator.classList.add('hidden');

        // Append simulated ai review response
        const aiResponse = document.createElement('div');
        aiResponse.className = 'flex items-start gap-3 max-w-[85%] animate-fadeIn';
        
        aiResponse.innerHTML = `
          <div class="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold text-amber-300 shrink-0">AI</div>
          <div class="space-y-3.5 flex-1">
            <div class="p-4 bg-white/[0.03]/80 border border-white/[0.05] rounded-r-2xl rounded-bl-2xl text-xs sm:text-sm text-gray-200 leading-relaxed shadow-sm space-y-2">
              <div class="flex items-center gap-1.5 text-xs text-amber-300 font-mono">
                <span>⚡ COGNITIVE COACH REPORT</span>
              </div>
              
              <div class="space-y-1.5 pt-1 text-[11px] sm:text-xs">
                <p><strong class="text-emerald-400">✓ WHAT SHINES:</strong> ${feedback.well}</p>
                <p><strong class="text-amber-400">⚠️ ATS / INTERVIEW GAPS:</strong> ${feedback.missing}</p>
              </div>

              <div class="pt-2 border-t border-white/[0.05] text-xs font-medium text-gray-300 leading-relaxed">
                ${feedback.followUp}
              </div>
            </div>
          </div>
        `;

        chatMessagesArea.appendChild(aiResponse);
        
        // Final smooth scroll
        chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
        chatHistory.push({
          role: 'assistant',
          text: `What shines: ${feedback.well}\nGap: ${feedback.missing}\nFollow-up: ${feedback.followUp}`
        });
        chatInputText.disabled = false;
        chatInputText.focus();
      }, 1200);
    });
  }

  // --- Mobile Responsive Navbar Toggling Logic ---
  const mobileMenuToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileNavigationDropdown = document.getElementById('mobile-navigation-dropdown');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuToggleBtn && mobileNavigationDropdown) {
    mobileMenuToggleBtn.addEventListener('click', () => {
      const isHidden = mobileNavigationDropdown.classList.contains('hidden');
      if (isHidden) {
        mobileNavigationDropdown.classList.remove('hidden');
        hamburgerIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
      } else {
        mobileNavigationDropdown.classList.add('hidden');
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }
    });

    // Close mobile dropdown when clicking any of the links
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavigationDropdown.classList.add('hidden');
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      });
    });
  }

  // Set default initial chat state
  resetChat('tough');
});


