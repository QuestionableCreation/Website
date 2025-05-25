class TextScrambleReveal {
    constructor(el)
    {
        this.el = el;
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz¿!@#$%^&*()_+-=[]{}|;:,.<>?';
        this.maxScrambleAhead = 5;
        this.originalText = el.textContent;
        this.isAnimating = false;
        this.animationId = null;
        
        
        this.preGeneratedChars = [];
        this.charIndex = 0;
        this.generateRandomChars();
    }

    generateRandomChars()
    {
        
        this.preGeneratedChars = [];
        for (let i = 0; i < 1000; i++)
        {
            this.preGeneratedChars.push(this.chars[Math.floor(Math.random() * this.chars.length)]);
        }
        this.charIndex = 0;
    }

    reveal(text = null)
    {
        const targetText = text || this.originalText;
        
        
        if (this.isAnimating) 
        {
            this.stopCurrentAnimation();
        }
        
        this.originalText = targetText;
        this.revealedIndex = 0;
        this.isAnimating = true;
        this.startTime = performance.now();
        
        const promise = new Promise((resolve) =>
        {
            this.resolve = resolve;
        });
        
        
        this.startAnimation();
        return promise;
    }

    startAnimation() 
    {
        if (!this.isAnimating) return;
        
        const now = performance.now();
        const elapsed = now - this.startTime;
        
        
        if (elapsed >= 50)
        {
            this.updateDisplay();
            this.startTime = now;
            
            
            this.revealedIndex++;
        }
        
       
        this.animationId = setTimeout(() => this.startAnimation(), 16); 
    }

    updateDisplay()
    {
        let output = '';
        const textLength = this.originalText.length;
        
       
        for (let i = 0; i < this.revealedIndex; i++) 
        {
            output += this.originalText[i];
        }
        
        
        const scrambleEnd = Math.min(this.revealedIndex + this.maxScrambleAhead, textLength);
        for (let i = this.revealedIndex; i < scrambleEnd; i++) {
            if (this.originalText[i] === ' ')
            {
                output += ' '; 
            } 
            else
            {
                output += this.getRandomChar();
            }
        }
        
        this.el.textContent = output;
        
        if (this.revealedIndex >= textLength)
            {
            this.el.textContent = this.originalText;
            this.isAnimating = false;
            if (this.resolve)
            {
                this.resolve();
            }
            this.stopCurrentAnimation();
        }
    }

    getRandomChar() 
    {
       
        const char = this.preGeneratedChars[this.charIndex];
        this.charIndex = (this.charIndex + 1) % this.preGeneratedChars.length;
        
        
        if (this.charIndex === 0)
        {
            this.generateRandomChars();
        }
        
        return char;
    }

    stopCurrentAnimation() 
    {
        this.isAnimating = false;
        if (this.animationId) 
        {
            clearTimeout(this.animationId);
            this.animationId = null;
        }
        if (this.resolve) 
        {
            this.resolve();
            this.resolve = null;
        }
    }

    reset() 
    {
        this.stopCurrentAnimation();
        this.el.textContent = this.originalText;
    }
}


const scramblers = new Map();

function initScrambler(element) 
{
    if (!scramblers.has(element)) 
        {
        scramblers.set(element, new TextScrambleReveal(element));
    }
    return scramblers.get(element);
}

function scrambleElement(elementOrId, text = null) 
{
    let element;
    if (typeof elementOrId === 'string') {
        element = document.getElementById(elementOrId);
    } else {
        element = elementOrId;
    }
    
    if (!element) {
        console.warn('Element not found:', elementOrId);
        return Promise.resolve();
    }
    
    const scrambler = initScrambler(element);
    return scrambler.reveal(text);
}

function handleIntersection(entries) 
{
    entries.forEach(entry => 
        {
        const scrambler = initScrambler(entry.target);
        if (entry.isIntersecting) 
        {
            scrambleElement(entry.target);
        } else 
        {
            scrambler.reset();
        }
    });
}


function initScrollScramble() 
{
    const observer = new IntersectionObserver(handleIntersection, 
    {
        threshold: 0.1, 
    });
    
    const elements = document.querySelectorAll('.scramble-text');
    elements.forEach(element => observer.observe(element));
}


window.addEventListener('load', () => 
{
    initScrollScramble();
});