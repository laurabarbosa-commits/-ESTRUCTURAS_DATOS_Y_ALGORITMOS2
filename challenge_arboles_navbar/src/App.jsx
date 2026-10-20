import { useState } from "react";


class MenuNode {
  constructor(title, link, component = null) {
    this.title = title;
    this.link = link;
    this.component = component;
    this.children = [];
  }

  addChild(childNode) {
    this.children.push(childNode);
  }
}


function buildMenuTree() {
  const root = new MenuNode("Menú", "#", null);

  const profile = new MenuNode("Perfil", "/perfil", "PerfilPage");
  const messages = new MenuNode("Mensajes", "/mensajes", "MensajesPage");

  const settings = new MenuNode("Configuración", "/configuracion", "SettingsPage");
  const account = new MenuNode("Cuenta", "/configuracion/account", "AccountPage");
  const security = new MenuNode("Seguridad y Privacidad", "/configuracion/security", "SecurityPage");
  const password = new MenuNode("Contraseña", "/configuracion/password", "PasswordPage");
  const notifications = new MenuNode("Notificaciones", "/configuracion/notifications", "NotificationsPage");

  settings.addChild(account);
  settings.addChild(security);
  settings.addChild(password);
  settings.addChild(notifications);

  const help = new MenuNode("Ayuda", "/ayuda", "AyudaPage");
  const faqs = new MenuNode("Preguntas Frecuentes", "/ayuda/faqs", "FaqsPage");
  const submitTicket = new MenuNode("Enviar un Ticket", "/ayuda/ticket", "TicketPage");

  help.addChild(faqs);
  help.addChild(submitTicket);

  root.addChild(profile);
  root.addChild(messages);
  root.addChild(settings);
  root.addChild(help);

  return root;
}

const menuTree = buildMenuTree();

function MenuItem({ node, onSelect, selectedLink }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onSelect(node);
    }
  };

  const isSelected = selectedLink === node.link;

  return (
    <li>
      <div
        onClick={handleClick}
        style={{
          padding: "0.6rem 1rem",
          cursor: "pointer",
          backgroundColor: isSelected ? "#3b5bdb" : "transparent",
          color: isSelected ? "white" : "#ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "4px",
        }}
      >
        <span>{node.title}</span>
        {hasChildren && <span>{isOpen ? "▲" : "▼"}</span>}
      </div>

      {hasChildren && isOpen && (
        <ul style={{ listStyle: "none", paddingLeft: "1.2rem", margin: 0 }}>
          {node.children.map((child, index) => (
            <MenuItem
              key={index}
              node={child}
              onSelect={onSelect}
              selectedLink={selectedLink}
            />
          ))}
        </ul>
      )}
    </li>
  );
}


function App() {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div style={{ display: "flex", fontFamily: "Arial, sans-serif" }}>
      <nav
        style={{
          width: "260px",
          minHeight: "100vh",
          backgroundColor: "#1e1e2f",
          padding: "1rem",
        }}
      >
        <h2 style={{ color: "white", marginBottom: "1rem" }}>📋 Menú</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuTree.children.map((child, index) => (
            <MenuItem
              key={index}
              node={child}
              onSelect={setSelectedNode}
              selectedLink={selectedNode?.link}
            />
          ))}
        </ul>
      </nav>

      <main style={{ padding: "2rem", flex: 1 }}>
        {selectedNode ? (
          <div>
            <h1>{selectedNode.title}</h1>
            <p>
              <strong>Link:</strong> {selectedNode.link}
            </p>
            <p>
              <strong>Componente:</strong> {selectedNode.component}
            </p>
          </div>
        ) : (
          <p>Selecciona una opción del menú</p>
        )}
      </main>
    </div>
  );
}

export default App;