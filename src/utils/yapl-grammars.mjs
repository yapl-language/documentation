// YAPL Grammar Loader for Starlight
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load YAPL TextMate grammars for syntax highlighting
 * This follows the Starlight recommended approach for custom languages
 */
export function loadYaplGrammars() {
  const grammarsPath = path.resolve(__dirname, '../../../yapl-vscode/syntaxes');
  
  try {
    // Load the YAPL Markdown grammar (most comprehensive)
    const yaplMdGrammar = JSON.parse(
      fs.readFileSync(path.join(grammarsPath, 'yapl-md.tmLanguage.json'), 'utf-8')
    );
    
    // Create a unified YAPL grammar for code blocks
    // This will be used when someone writes ```yapl
    const yaplGrammar = {
      ...yaplMdGrammar,
      scopeName: 'source.yapl',
      name: 'YAPL',
      fileTypes: ['yapl'],
      // Remove markdown-specific includes for pure YAPL code blocks
      patterns: yaplMdGrammar.patterns.filter(pattern => 
        !pattern.include || pattern.include !== 'text.html.markdown'
      )
    };
    
    console.log('✅ YAPL grammars loaded successfully');
    return [yaplGrammar];
    
  } catch (error) {
    console.warn('⚠️  Could not load YAPL grammars:', error.message);
    console.warn('   YAPL syntax highlighting will not be available');
    console.warn('   Make sure yapl-vscode directory exists at:', grammarsPath);
    return [];
  }
}

/**
 * Alternative approach: Load all YAPL grammar variants
 */
export function loadAllYaplGrammars() {
  const grammarsPath = path.resolve(__dirname, '../../../yapl-vscode/syntaxes');
  const grammars = [];
  
  try {
    // Load all YAPL grammar files
    const grammarFiles = [
      'yapl-md.tmLanguage.json',
      'yapl-txt.tmLanguage.json',
      'yapl-json.tmLanguage.json',
      'yapl-yaml.tmLanguage.json'
    ];
    
    for (const file of grammarFiles) {
      try {
        const grammar = JSON.parse(
          fs.readFileSync(path.join(grammarsPath, file), 'utf-8')
        );
        grammars.push(grammar);
      } catch (err) {
        console.warn(`Could not load ${file}:`, err.message);
      }
    }
    
    // Create main YAPL grammar
    if (grammars.length > 0) {
      const baseGrammar = grammars[0]; // Use markdown grammar as base
      const yaplGrammar = {
        ...baseGrammar,
        scopeName: 'source.yapl',
        name: 'YAPL',
        fileTypes: ['yapl'],
        patterns: baseGrammar.patterns.filter(pattern => 
          !pattern.include || !pattern.include.startsWith('text.')
        )
      };
      grammars.unshift(yaplGrammar);
    }
    
    console.log(`✅ Loaded ${grammars.length} YAPL grammar variants`);
    return grammars;
    
  } catch (error) {
    console.warn('⚠️  Could not load YAPL grammars:', error.message);
    return [];
  }
}