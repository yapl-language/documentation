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
  // Try multiple possible paths for the yapl-vscode directory
  const possiblePaths = [
    path.resolve(__dirname, '../../../yapl-vscode/syntaxes'),
    path.resolve(__dirname, '../../../../yapl-vscode/syntaxes'),
    path.resolve(process.cwd(), '../yapl-vscode/syntaxes'),
    path.resolve(process.cwd(), 'yapl-vscode/syntaxes')
  ];
  
  for (const grammarsPath of possiblePaths) {
    try {
      // Check if the directory exists
      if (!fs.existsSync(grammarsPath)) {
        continue;
      }
      
      // Load the YAPL text grammar as base (cleaner for code blocks)
      const yaplTxtGrammar = JSON.parse(
        fs.readFileSync(path.join(grammarsPath, 'yapl-txt.tmLanguage.json'), 'utf-8')
      );
      
      // Create a unified YAPL grammar for code blocks
      // This will be used when someone writes ```yapl
      const yaplGrammar = {
        ...yaplTxtGrammar,
        scopeName: 'source.yapl',
        name: 'YAPL',
        fileTypes: ['yapl'],
        // Remove text.plain include for pure YAPL code blocks
        patterns: yaplTxtGrammar.patterns.filter(pattern => 
          !pattern.include || pattern.include !== 'text.plain'
        )
      };
      
      console.log('✅ YAPL grammars loaded successfully from:', grammarsPath);
      return [yaplGrammar];
      
    } catch (error) {
      console.warn(`⚠️  Could not load YAPL grammars from ${grammarsPath}:`, error.message);
      continue;
    }
  }
  
  // Fallback to the local grammar file
  try {
    const fallbackGrammar = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../grammars/yapl.tmLanguage.json'), 'utf-8')
    );
    console.log('✅ Using fallback YAPL grammar');
    return [fallbackGrammar];
  } catch (fallbackError) {
    console.warn('⚠️  Fallback grammar also failed:', fallbackError.message);
    
    // Return a minimal inline grammar as last resort
    console.log('🔧 Using minimal inline YAPL grammar');
    return [{
      scopeName: 'source.yapl',
      name: 'YAPL',
      fileTypes: ['yapl'],
      patterns: [
        {
          name: 'comment.block.yapl',
          begin: '\\{#',
          end: '#\\}',
          patterns: [{ match: '.', name: 'comment.block.yapl.inner' }]
        },
        {
          name: 'meta.interpolation.yapl',
          begin: '\\{\\{\\-?\\s*',
          beginCaptures: { 0: { name: 'punctuation.definition.interpolation.begin.yapl' } },
          end: '\\s*\\-?\\}\\}',
          endCaptures: { 0: { name: 'punctuation.definition.interpolation.end.yapl' } },
          patterns: [
            { match: '\\|\\s*[a-zA-Z_][a-zA-Z0-9_]*', name: 'support.function.filter.yapl' },
            { match: '[a-zA-Z_][a-zA-Z0-9_\\.]*', name: 'variable.other.yapl' },
            { match: '\\\"[^\\\"]*\\\"|\'[^\']*\'', name: 'string.quoted.yapl' },
            { match: '\\b[0-9]+(\\.[0-9]+)?\\b', name: 'constant.numeric.yapl' },
            { match: '\\b(true|false|null)\\b', name: 'constant.language.yapl' }
          ]
        },
        {
          name: 'meta.directive.yapl',
          begin: '\\{\\%\\-?\\s*',
          beginCaptures: { 0: { name: 'punctuation.section.directive.begin.yapl' } },
          end: '\\s*\\-?\\%\\}',
          endCaptures: { 0: { name: 'punctuation.section.directive.end.yapl' } },
          patterns: [
            { match: '\\b(extends|block|endblock|include|with|mixin|use|import|as|if|else|elif|endif|for|endfor)\\b', name: 'keyword.control.yapl' },
            { match: '[a-zA-Z_][a-zA-Z0-9_\\.:-]*', name: 'entity.name.yapl' },
            { match: '\\\"[^\\\"]*\\\"|\'[^\']*\'', name: 'string.quoted.yapl' },
            { match: '\\|\\s*[a-zA-Z_][a-zA-Z0-9_]*', name: 'support.function.filter.yapl' }
          ]
        }
      ]
    }];
  }
}

/**
 * Alternative approach: Load all YAPL grammar variants
 */
export function loadAllYaplGrammars() {
  const possiblePaths = [
    path.resolve(__dirname, '../../../yapl-vscode/syntaxes'),
    path.resolve(__dirname, '../../../../yapl-vscode/syntaxes'),
    path.resolve(process.cwd(), '../yapl-vscode/syntaxes'),
    path.resolve(process.cwd(), 'yapl-vscode/syntaxes')
  ];
  
  for (const grammarsPath of possiblePaths) {
    try {
      if (!fs.existsSync(grammarsPath)) {
        continue;
      }
      
      const grammars = [];
      
      // Load all YAPL grammar files
      const grammarFiles = [
        'yapl-txt.tmLanguage.json',
        'yapl-md.tmLanguage.json',
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
      
      // Create main YAPL grammar for code blocks
      if (grammars.length > 0) {
        const baseGrammar = grammars.find(g => g.scopeName === 'text.yapl.txt') || grammars[0];
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
      
      console.log(`✅ Loaded ${grammars.length} YAPL grammar variants from:`, grammarsPath);
      return grammars;
      
    } catch (error) {
      console.warn(`⚠️  Could not load YAPL grammars from ${grammarsPath}:`, error.message);
      continue;
    }
  }
  
  // Fallback to the local grammar file
  try {
    const fallbackGrammar = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../grammars/yapl.tmLanguage.json'), 'utf-8')
    );
    console.log('✅ Using fallback YAPL grammar');
    return [fallbackGrammar];
  } catch (fallbackError) {
    console.warn('⚠️  Fallback grammar also failed:', fallbackError.message);
    return loadYaplGrammars(); // Use the inline grammar from the main function
  }
}