"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { Button } from "../Button/Button";
import { ButtonIcon } from "../ButtonIcon/ButtonIcon";
import { Chips } from "../Chips/Chips";
import { IconSlot } from "../IconSlot/IconSlot";
import { Camera01, FlashcardStack01, Loading01, Microphone01, Plus01, Send01, StackSparkle01, XClose } from "../Icons/Icons";
import { useDragScroll } from "@/lib/dragScroll";
import styles from "./ChatInput.module.css";

/**
 * The chat input bar Knowie's screens use. Figma: "Chat Input" component set.
 *
 * WHAT IT IS: The chat input bar Knowie's screens use. One variant
 * (state): Default, Chip attached, Answer.
 *
 * WHEN TO USE IT: state=Default for the standard "Ask anything" entry
 * point (Home chat). state=Chip attached when a category/context filter (a
 * chips instance) is pinned above the text entry. state=Answer for the
 * no-attachment, send-button variant used when answering inside a guided
 * flow.
 *
 * DON'T: Don't reach for the deprecated "OLD Icon Button" component for
 * the leading "+" — use the real buttonIcon component (variant=Secondary,
 * size=L) with plus-01 swapped in. Don't bind placeholder text to
 * text/disabled — use text/secondary.
 *
 * Composed from ButtonIcon (leading +), Button (the Camera/Gallery/Files
 * row), Chips (the attached chip), and IconSlot (the trailing mic/send
 * icon, including Answer's own send button — per direct instruction, it
 * used to be a filled ButtonIcon circle; matches this same plain-icon
 * treatment now, like Home chat's own trailing icon) — all already-built
 * components.
 *
 * KNOWN GAP: the "Chip attached" variant's frame also holds a Camera /
 * Gallery / Files attachment row, sitting in an auto-named, unrenamed
 * frame and never mentioned in this component's own Figma description
 * (which only describes the chip). Included here per direction, not
 * invented — but Figma's own icon choices for it are reproduced as-is:
 * Camera and Gallery both use camera-01, and Files uses stack-sparkle-01
 * (not a files icon), a real mismatch in the source.
 *
 * The trailing mic icon is a bare Icon Slot instance in Figma, not a
 * buttonIcon — no Figma-defined Pressed/Disabled state exists for it.
 * Made tappable here as a practical, disclosed judgment call (a trailing
 * mic icon in a chat input is a standard "switch to voice" affordance).
 *
 * On Default and Chip attached, that same trailing slot swaps from the mic
 * icon to a send icon once the field has text — a standard chat-input
 * pattern (voice by default, switches to send once you're typing) not
 * itself named as a Figma variant, so disclosed here rather than assumed.
 * `onSend` (already used by Answer's dedicated send button) doubles for
 * this swapped state; provide it whenever Default/Chip attached should
 * support sending typed text.
 */

// The text row's height isn't a fixed design value — Figma's own "Chip
// attached" example is taller only because its placeholder ("Tell me what
// you want to practice...") wraps to two lines, not because the box has a
// fixed height. This grows the textarea to fit whatever text is actually
// showing (value, or placeholder while empty) instead of hardcoding a
// pixel height that would only be correct for that one example string.
function useAutoGrowTextarea(text: string, placeholder: string) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (text) {
      // Never touch a controlled textarea's real `.value` while it holds
      // actual (typed) text — reassigning it here, even back to the same
      // string, was fighting the browser's own cursor/selection handling
      // on every keystroke and made typing feel broken. `scrollHeight`
      // already reflects the real content without needing that.
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
      return;
    }
    // Empty: browsers don't factor the `placeholder` attribute into
    // scrollHeight, so the only way to size the box for a wrapping
    // placeholder (e.g. "Chip attached"'s two-line example) is to swap
    // the placeholder text in just long enough to measure it, then
    // restore the same empty value.
    const original = el.value;
    el.value = placeholder;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    el.value = original;
  }, [text, placeholder]);

  return ref;
}

export type ChatInputState = "Default" | "Chip attached" | "Answer";

export interface ChatInputProps {
  state?: ChatInputState;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Leading "+" button. Default and Chip attached only. */
  onAttachClick?: () => void;
  "attachAriaLabel"?: string;
  /** Trailing mic icon. Default and Chip attached only — swaps to the send
   * icon once the field has text (see `onSend`). */
  onMicClick?: () => void;
  micAriaLabel?: string;
  /** Trailing send action. Answer's dedicated send button, and Default/Chip
   * attached's trailing icon once it's swapped from mic to send. */
  onSend?: () => void;
  sendAriaLabel?: string;
  /** Answer only — shows a spinning loading icon in place of the send
   * icon and disables the button, for the beat right after tapping send
   * while typed text (per direct instruction, distinct from the
   * recording button's own spin, which this replaces for a text send). */
  sending?: boolean;
  /** Chip attached only — the pinned category/context chip. Figma default: "Recall exercice". */
  chipText?: string;
  chipIcon?: ReactNode;
  onChipRemove?: () => void;
  /** Chip attached only — the Camera/Gallery/Files row. See KNOWN GAP above. */
  onCameraClick?: () => void;
  onGalleryClick?: () => void;
  onFilesClick?: () => void;
}

export function ChatInput({
  state = "Default",
  value,
  onChange,
  placeholder,
  onAttachClick,
  attachAriaLabel = "Add attachment",
  onMicClick,
  micAriaLabel = "Use voice input",
  onSend,
  sendAriaLabel = "Send",
  sending = false,
  chipText = "Recall exercice",
  chipIcon = <FlashcardStack01 />,
  onChipRemove,
  onCameraClick,
  onGalleryClick,
  onFilesClick,
}: ChatInputProps) {
  const isAnswer = state === "Answer";
  const isChipAttached = state === "Chip attached";
  // The Camera/Gallery/Files row overflows 390px — scrolls by mouse-drag
  // now, same as Home's activity/quick-action rows, instead of showing a
  // native scrollbar. Called unconditionally (before the Answer state's
  // early return below) since hooks can't follow a conditional return.
  const attachmentRowRef = useDragScroll<HTMLDivElement>();
  const resolvedPlaceholder = placeholder ?? (isAnswer ? "Type to answer" : "Ask anything");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const textareaRef = useAutoGrowTextarea(value, resolvedPlaceholder);

  if (isAnswer) {
    return (
      <div className={styles.answerBar}>
        {/* Was a single-line <input> — grows with useAutoGrowTextarea like
           the other two states already do, per direct instruction, so a
           wrapped or multi-line answer doesn't get clipped. */}
        <textarea
          ref={textareaRef}
          className={styles.answerInput}
          value={value}
          onChange={handleChange}
          placeholder={resolvedPlaceholder}
          rows={1}
        />
        {/* Was a ButtonIcon (Primary, S) — a filled 48px circle, much
           bigger than Home chat's own trailing send/mic icon (a bare
           IconSlot in a plain reset button). Per direct instruction,
           matches that same treatment here instead, which also fixes the
           other reason this was ever wrapped in the first place: a plain
           icon this size no longer overshoots the text line's own height,
           so the sendButtonWrap negative-margin trick that used to cancel
           the wrapper button's extra height isn't needed anymore either. */}
        <button
          type="button"
          className={styles.answerSendButton}
          aria-label={sendAriaLabel}
          aria-busy={sending || undefined}
          disabled={sending}
          onClick={onSend}
        >
          <IconSlot size="300" icon={sending ? <Loading01 /> : <Send01 />} />
        </button>
      </div>
    );
  }

  const chip = (
    <Chips
      text={chipText}
      showLeftIcon
      showRightIcon
      leftIcon={chipIcon}
      rightIcon={<XClose />}
      color="Primary"
      size="XS"
      active="False"
    />
  );

  return (
    <div className={[styles.root, isChipAttached && styles.chipAttached].filter(Boolean).join(" ")}>
      <ButtonIcon
        variant="Secondary"
        size="L"
        icon={<Plus01 />}
        aria-label={attachAriaLabel}
        onClick={onAttachClick}
      />
      <div className={styles.contentColumn}>
        {isChipAttached && (
          <div className={styles.attachmentRow} ref={attachmentRowRef}>
            <Button
              variant="Secondary"
              size="M"
              cta="Camera"
              showLeftIcon
              leftIcon={<Camera01 />}
              onClick={onCameraClick}
            />
            <Button
              variant="Secondary"
              size="M"
              cta="Gallery"
              showLeftIcon
              leftIcon={<Camera01 />}
              onClick={onGalleryClick}
            />
            <Button
              variant="Secondary"
              size="M"
              cta="Files"
              showLeftIcon
              leftIcon={<StackSparkle01 />}
              onClick={onFilesClick}
            />
          </div>
        )}
        <div className={[styles.inputPill, isChipAttached && styles.chipAttached].filter(Boolean).join(" ")}>
          {isChipAttached &&
            (onChipRemove ? (
              <button
                type="button"
                className={styles.chipRemove}
                aria-label={`Remove ${chipText}`}
                onClick={onChipRemove}
              >
                {chip}
              </button>
            ) : (
              chip
            ))}
          <div className={styles.textRow}>
            <textarea
              ref={textareaRef}
              className={styles.textInput}
              value={value}
              onChange={handleChange}
              placeholder={resolvedPlaceholder}
              rows={1}
            />
            {value.trim().length > 0 ? (
              <button type="button" className={styles.micButton} aria-label={sendAriaLabel} onClick={onSend}>
                <IconSlot size="300" icon={<Send01 />} />
              </button>
            ) : (
              <button type="button" className={styles.micButton} aria-label={micAriaLabel} onClick={onMicClick}>
                <IconSlot size="300" icon={<Microphone01 />} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
