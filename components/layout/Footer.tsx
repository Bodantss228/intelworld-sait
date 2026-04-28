export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-3">
              <span className="text-primary">Intel</span>
              <span className="text-white">World</span>
            </h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Юбилейный 5-й сезон. Тема "What If..." - исследование альтернативных реальностей вселенной IntelWorld.
            </p>
            <p className="text-sm text-gray-500">
              Ванилла+ сервер на Fabric 1.21.x
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Навигация</h4>
            <ul className="space-y-2">
              <li>
                <a href="/ecosystem" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Экосистема
                </a>
              </li>
              <li>
                <a href="/timeline" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Архив сезонов
                </a>
              </li>
              <li>
                <a href="http://white.fnode.me:8316" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Карта мира
                </a>
              </li>
              <li>
                <a href="/downloads" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Скачать модпак
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Подключение</h4>
            <p className="text-sm text-gray-400 mb-2">IP сервера:</p>
            <code className="bg-black px-3 py-2 rounded text-primary text-sm block">
              play.intelworld.ru
            </code>
            <p className="text-xs text-gray-500 mt-3">
              Версия: 1.21.x (Fabric)
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; 2026 IntelWorld. Все права защищены.
          </p>
          <p className="text-gray-600 text-xs mt-2 md:mt-0">
            Сезон 5: "What If..."
          </p>
        </div>
      </div>
    </footer>
  );
}
