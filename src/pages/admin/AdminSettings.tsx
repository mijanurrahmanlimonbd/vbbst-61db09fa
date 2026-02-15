import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FieldErrors {
  [key: string]: boolean;
}

const AdminSettings = () => {
  // General
  const [siteTitle, setSiteTitle] = useState("VBB STORE");
  const [siteDescription, setSiteDescription] = useState(
    "Your trusted source for verified Facebook Business Managers"
  );
  const [contactEmail, setContactEmail] = useState("info@verifiedbmbuy.com");
  const [whatsapp, setWhatsapp] = useState("+1 234 567 890");

  // Profile
  const [displayName, setDisplayName] = useState("Admin");
  const [profileEmail, setProfileEmail] = useState("admin@vbbstore.com");
  const [bio, setBio] = useState("");

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const validateGeneral = () => {
    const e: FieldErrors = {};
    if (!siteTitle.trim()) e.siteTitle = true;
    if (!contactEmail.trim()) e.contactEmail = true;
    return e;
  };

  const validateProfile = () => {
    const e: FieldErrors = {};
    if (!displayName.trim()) e.displayName = true;
    if (!profileEmail.trim()) e.profileEmail = true;
    return e;
  };

  const validateSecurity = () => {
    const e: FieldErrors = {};
    if (!currentPassword.trim()) e.currentPassword = true;
    if (!newPassword.trim()) e.newPassword = true;
    if (!confirmPassword.trim()) e.confirmPassword = true;
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      e.confirmPassword = true;
    }
    return e;
  };

  const handleSave = async (tab: string) => {
    let fieldErrors: FieldErrors = {};

    if (tab === "general") fieldErrors = validateGeneral();
    else if (tab === "profile") fieldErrors = validateProfile();
    else if (tab === "security") fieldErrors = validateSecurity();

    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    // Simulate save
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success("Settings saved successfully.");
  };

  const inputClass = (field: string) =>
    cn(errors[field] && "border-destructive ring-destructive focus-visible:ring-destructive");

  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Settings</h2>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setErrors({}); }}>
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <div className="bg-background rounded-xl border border-border p-6 space-y-5 mt-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Site Title <span className="text-destructive">*</span>
              </label>
              <Input
                value={siteTitle}
                onChange={(e) => { setSiteTitle(e.target.value); setErrors((p) => ({ ...p, siteTitle: false })); }}
                className={inputClass("siteTitle")}
              />
              {errors.siteTitle && <p className="text-xs text-destructive mt-1">Site title is required.</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Site Description</label>
              <Textarea
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Contact Email <span className="text-destructive">*</span>
              </label>
              <Input
                value={contactEmail}
                onChange={(e) => { setContactEmail(e.target.value); setErrors((p) => ({ ...p, contactEmail: false })); }}
                className={inputClass("contactEmail")}
              />
              {errors.contactEmail && <p className="text-xs text-destructive mt-1">Contact email is required.</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">WhatsApp Number</label>
              <Input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>
            <Button onClick={() => handleSave("general")} disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="bg-background rounded-xl border border-border p-6 space-y-5 mt-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Current Password <span className="text-destructive">*</span>
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setErrors((p) => ({ ...p, currentPassword: false })); }}
                className={inputClass("currentPassword")}
                placeholder="Enter current password"
              />
              {errors.currentPassword && <p className="text-xs text-destructive mt-1">Current password is required.</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                New Password <span className="text-destructive">*</span>
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, newPassword: false })); }}
                className={inputClass("newPassword")}
                placeholder="Enter new password"
              />
              {errors.newPassword && <p className="text-xs text-destructive mt-1">New password is required.</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Confirm Password <span className="text-destructive">*</span>
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: false })); }}
                className={inputClass("confirmPassword")}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">
                  {newPassword !== confirmPassword ? "Passwords do not match." : "Confirm password is required."}
                </p>
              )}
            </div>
            <Button onClick={() => handleSave("security")} disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Password
            </Button>
          </div>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile">
          <div className="bg-background rounded-xl border border-border p-6 space-y-5 mt-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Display Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={displayName}
                onChange={(e) => { setDisplayName(e.target.value); setErrors((p) => ({ ...p, displayName: false })); }}
                className={inputClass("displayName")}
              />
              {errors.displayName && <p className="text-xs text-destructive mt-1">Display name is required.</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                value={profileEmail}
                onChange={(e) => { setProfileEmail(e.target.value); setErrors((p) => ({ ...p, profileEmail: false })); }}
                className={inputClass("profileEmail")}
              />
              {errors.profileEmail && <p className="text-xs text-destructive mt-1">Email is required.</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Tell us about yourself…"
              />
            </div>
            <Button onClick={() => handleSave("profile")} disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Profile
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
