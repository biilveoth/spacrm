import { useState } from 'react';
import { TagListTab } from './TagListTab';
import { AutomationRulesTab } from './AutomationRulesTab';
import { ExecutionLogTab } from './ExecutionLogTab';

const tabs = [
  { key: 'tags', label: 'Quản lý thẻ tag' },
  { key: 'rules', label: 'Quy tắc tự động' },
  { key: 'logs', label: 'Nhật ký thực thi' },
];

export function TagManagementPage() {
  const [activeTab, setActiveTab] = useState('tags');
  const [logFilterRule, setLogFilterRule] = useState<string | null>(null);

  const goToLogForRule = (ruleName: string) => {
    setLogFilterRule(ruleName);
    setActiveTab('logs');
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg text-gray-900">Thẻ tag</h1>
            <p className="text-xs text-gray-500 mt-0.5">Quản lý thẻ tag, trạng thái và quy tắc tự động gắn thẻ</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); if (tab.key !== 'logs') setLogFilterRule(null); }}
              className={`px-5 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'tags' && <TagListTab />}
        {activeTab === 'rules' && <AutomationRulesTab onViewLog={goToLogForRule} />}
        {activeTab === 'logs' && <ExecutionLogTab initialRuleFilter={logFilterRule} />}
      </div>
    </div>
  );
}
