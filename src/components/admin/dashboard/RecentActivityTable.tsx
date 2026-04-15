import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ActivityRow {
  id: string;
  date: Date;
  status: "published" | "draft" | "pending" | "completed" | "approved";
  author: string;
  title: string;
  type: "post" | "order" | "comment";
  editLink: string;
}

const statusStyles: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  approved: "bg-green-100 text-green-700",
  draft: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
};

const RecentActivityTable = () => {
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [postsRes, ordersRes, commentsRes] = await Promise.all([
        supabase.from("blog_posts").select("id, title, status, author, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("orders").select("id, customer_name, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("comments").select("id, author_name, status, content, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      const items: ActivityRow[] = [];

      (postsRes.data || []).forEach((p: any) => {
        items.push({
          id: p.id,
          date: new Date(p.created_at),
          status: p.status as any,
          author: p.author || "Admin",
          title: p.title,
          type: "post",
          editLink: `/admin/posts/${p.id}/edit`,
        });
      });

      (ordersRes.data || []).forEach((o: any) => {
        items.push({
          id: o.id,
          date: new Date(o.created_at),
          status: o.status as any,
          author: o.customer_name,
          title: `Order #${o.id.slice(0, 8)}`,
          type: "order",
          editLink: "/admin/orders",
        });
      });

      (commentsRes.data || []).forEach((c: any) => {
        items.push({
          id: c.id,
          date: new Date(c.created_at),
          status: c.status as any,
          author: c.author_name,
          title: c.content?.slice(0, 50) + "…",
          type: "comment",
          editLink: "/admin/comments",
        });
      });

      items.sort((a, b) => b.date.getTime() - a.date.getTime());
      setRows(items.slice(0, 10));
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="bg-white rounded-lg border border-[#dcdcde] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#dcdcde]">
        <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
      </div>
      {loading ? (
        <div className="p-5 space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-10">No activity yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f6f7f7] text-gray-500 text-xs">
                <th className="text-left px-4 py-2.5 font-medium">Date</th>
                <th className="text-left px-4 py-2.5 font-medium">Title</th>
                <th className="text-left px-4 py-2.5 font-medium">Status</th>
                <th className="text-left px-4 py-2.5 font-medium">Author</th>
                <th className="text-right px-4 py-2.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-[#f0f0f1] hover:bg-[#f6f7f7] transition-colors">
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {format(row.date, "MMM dd, yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={row.editLink} className="text-[#2271b1] hover:text-[#135e96] font-medium text-xs">
                      {row.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize",
                      statusStyles[row.status] || "bg-gray-100 text-gray-600"
                    )}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{row.author}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={row.editLink} className="p-1 rounded text-gray-400 hover:text-[#2271b1] hover:bg-[#2271b1]/5 transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentActivityTable;
