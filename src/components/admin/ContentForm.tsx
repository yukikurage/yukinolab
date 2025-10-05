"use client";

import { useState } from "react";
import { CMSField } from "@/lib/cms-config";

interface ArrayFieldProps {
  field: CMSField;
  value: Record<string, unknown>[];
  onChange: (value: Record<string, unknown>[]) => void;
}

function ArrayField({ field, value, onChange }: ArrayFieldProps) {
  const handleAdd = () => {
    onChange([...value, {}]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, itemData: Record<string, unknown>) => {
    const newValue = [...value];
    newValue[index] = itemData;
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <div key={index} className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-text-secondary">
              {field.label} #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              削除
            </button>
          </div>
          {field.itemFields?.map((itemField) => (
            <div key={itemField.name}>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                {itemField.label}
                {itemField.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {itemField.type === "text" && (
                <input
                  type="text"
                  value={(item[itemField.name] as string) || ""}
                  onChange={(e) =>
                    handleItemChange(index, { ...item, [itemField.name]: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border-strong rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-bg text-text text-sm"
                  placeholder={itemField.placeholder}
                />
              )}
              {itemField.type === "number" && (
                <input
                  type="number"
                  value={(item[itemField.name] as number) || ""}
                  onChange={(e) =>
                    handleItemChange(index, {
                      ...item,
                      [itemField.name]: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-border-strong rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-bg text-text text-sm"
                  placeholder={itemField.placeholder}
                />
              )}
              {itemField.type === "textarea" && (
                <textarea
                  value={(item[itemField.name] as string) || ""}
                  onChange={(e) =>
                    handleItemChange(index, { ...item, [itemField.name]: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border-strong rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none bg-bg text-text text-sm"
                  placeholder={itemField.placeholder}
                  rows={3}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="w-full px-4 py-2 border-2 border-dashed border-border-strong rounded-lg hover:border-primary transition-colors text-text-secondary hover:text-primary"
      >
        ＋ {field.label}を追加
      </button>
    </div>
  );
}

interface ContentFormProps {
  fields: CMSField[];
  initialData?: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  saving?: boolean;
}

export default function ContentForm({
  fields,
  initialData = {},
  onSave,
  onCancel,
  saving = false,
}: ContentFormProps) {
  const [formData, setFormData] =
    useState<Record<string, unknown>>(initialData);
  const [uploading, setUploading] = useState(false);

  const handleChange = (name: string, value: unknown) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (
    name: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const result = (await res.json()) as { url: string };
      handleChange(name, result.url);
    } catch (error) {
      alert("画像のアップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    // 必須フィールドチェック（null/undefinedのみをチェック、false/0は許可）
    const missingFields = fields
      .filter((f) => f.required && formData[f.name] == null)
      .map((f) => f.label);

    if (missingFields.length > 0) {
      alert(`必須フィールドが入力されていません: ${missingFields.join(", ")}`);
      return;
    }

    onSave(formData);
  };

  return (
    <div className="bg-bg border border-border-strong dark:border-primary rounded-lg p-6 space-y-6">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-semibold text-text-secondary mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === "text" && (
            <input
              type="text"
              value={(formData[field.name] as string) || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full px-4 py-3 border border-border-strong rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-bg text-text"
              placeholder={field.placeholder}
            />
          )}

          {field.type === "textarea" && (
            <textarea
              value={(formData[field.name] as string) || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full px-4 py-3 border border-border-strong rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none bg-bg text-text"
              placeholder={field.placeholder}
              rows={4}
            />
          )}

          {field.type === "markdown" && (
            <textarea
              value={(formData[field.name] as string) || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full px-4 py-3 border border-border-strong rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none bg-bg text-text font-mono text-sm"
              placeholder={field.placeholder}
              rows={12}
            />
          )}

          {field.type === "url" && (
            <input
              type="url"
              value={(formData[field.name] as string) || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full px-4 py-3 border border-border-strong rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-bg text-text"
              placeholder={field.placeholder || "https://example.com"}
            />
          )}

          {field.type === "image" && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(field.name, e)}
                className="w-full px-4 py-3 border border-border-strong rounded-lg bg-bg text-text cursor-pointer"
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-text-secondary mt-2">
                  アップロード中...
                </p>
              )}
              {formData[field.name] && (
                <div className="mt-4">
                  <img
                    src={formData[field.name] as string}
                    alt="Preview"
                    className="w-full max-w-md h-auto rounded-lg border border-border"
                  />
                </div>
              )}
            </>
          )}

          {field.type === "number" && (
            <input
              type="number"
              value={(formData[field.name] as number) || ""}
              onChange={(e) => handleChange(field.name, parseFloat(e.target.value))}
              className="w-full px-4 py-3 border border-border-strong rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-bg text-text"
              placeholder={field.placeholder}
            />
          )}

          {field.type === "boolean" && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(formData[field.name] as boolean) || false}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                className="w-5 h-5 border-2 border-border-strong rounded focus:ring-2 focus:ring-primary cursor-pointer"
              />
              <span className="text-text-secondary text-sm">
                {field.placeholder || "有効にする"}
              </span>
            </label>
          )}

          {field.type === "array" && field.itemFields && (
            <ArrayField
              field={field}
              value={(formData[field.name] as Record<string, unknown>[]) || []}
              onChange={(value) => handleChange(field.name, value)}
            />
          )}
        </div>
      ))}

      <div className="flex gap-4 pt-4">
        <button
          onClick={handleSubmit}
          disabled={saving || uploading}
          className="flex-1 px-6 py-3 bg-primary text-bg rounded-lg hover:bg-primary-dark transition-colors disabled:bg-text-tertiary disabled:cursor-not-allowed cursor-pointer font-semibold"
        >
          {saving ? "保存中..." : "保存する"}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="px-6 py-3 bg-surface-secondary text-text rounded-lg hover:bg-border transition-colors disabled:cursor-not-allowed cursor-pointer font-semibold"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
