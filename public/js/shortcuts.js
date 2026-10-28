// public/js/shortcuts.js
import { addServiceById } from './ui.js';

export function initShortcuts() {
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName;
    
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      if (e.key === 'Escape') document.activeElement.blur();
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      
      const shortcutMap = {
        'e': 'ec2', 
        'l': 'lambda', 
        'k': 'ecs', 
        'i': 'lightsail',
        's': 's3', 
        'b': 'ebs', 
        'f': 'efs', 
        'g': 'glacier',
        'r': 'rds', 
        'd': 'dynamodb', 
        'a': 'aurora', 
        'h': 'elasticache',
        'o': 'cloudfront', 
        'z': 'route53', 
        'w': 'elb',
        'm': 'cloudwatch', 
        'n': 'sns', 
        'q': 'sqs', 
        'u': 'cognito', 
        'p': 'apigateway',
        'c': 'acm'
      };
      
      if (shortcutMap[key] && key !== 'p' && key !== 'k') {
        e.preventDefault();
        addServiceById(shortcutMap[key]);
        return;
      }
    }

    if (e.key === '/') {
      e.preventDefault();
      document.getElementById('globalSearch')?.focus();
    }

    if (e.key === '?') {
      e.preventDefault();
      document.getElementById('shortcutsModal').hidden = false;
    }

    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(m => m.hidden = true);
    }

    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'k') {
        e.preventDefault();
        document.getElementById('shareBtnHeader')?.click();
      }
      if (e.key === 'p') {
        e.preventDefault();
        document.getElementById('printBtnHeader')?.click();
      }
    }

    if (e.key === 'r' || e.key === 'R') {
      if (!e.ctrlKey && !e.metaKey) {
        document.getElementById('resetBtn')?.click();
      }
    }
  });

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(m => m.hidden = true);
    });
  });
}