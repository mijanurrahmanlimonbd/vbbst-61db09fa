const AdminPosts = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-foreground">Posts</h2>
      <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">New Post</button>
    </div>
    <div className="bg-background rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border bg-secondary/50"><th className="text-left px-6 py-3 font-medium text-muted-foreground">Title</th><th className="text-left px-6 py-3 font-medium text-muted-foreground hidden sm:table-cell">Category</th><th className="text-left px-6 py-3 font-medium text-muted-foreground hidden md:table-cell">Date</th><th className="px-6 py-3"></th></tr></thead>
        <tbody>
          {[{ title: "What is WhatsApp API", cat: "WhatsApp API", date: "Feb 13, 2026" }, { title: "Verified BM Guide", cat: "Verified BM", date: "Feb 4, 2026" }, { title: "Avoid BM Bans", cat: "Tips & Guides", date: "Jan 19, 2026" }].map((p, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="px-6 py-4 font-medium text-foreground">{p.title}</td>
              <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell"><span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{p.cat}</span></td>
              <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{p.date}</td>
              <td className="px-6 py-4 text-right"><button className="text-primary text-xs font-medium hover:underline">Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminPosts;
