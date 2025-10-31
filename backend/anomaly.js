import { InferenceClient } from "@huggingface/inference";
/**
 * @param {import('pg').Pool} pool
 */

export async function getAnomalies(pool) {
  const query = `
    SELECT
      CONCAT(
        'Patient ', p.p_name, ' (', p.gender, ', born ', p.dob, '). ',
        'Specimen type: ', s.specimen_type, '. ',
        'Test: ', t.test_name, ' (LOINC ', t.loinc_code, '). ',
        'Result: ', r.result, '. ',
        'Report prepared by ', r.created_by, 
        ', validated by ', r.validated_by, '.'
      ) AS embedding_text
    FROM lims.reports r
    JOIN lims.samples s ON r.sample_id = s.sample_id
    JOIN lims.patients p ON s.p_id = p.p_id
    JOIN lims.tests t 
      ON r.loinc_code = t.loinc_code 
     AND r.specimen_type = t.specimen_type
    WHERE s.current_status = 'DONE'
    ORDER BY r.sample_id, r.loinc_code;
  `;
  const client = await pool.connect();
  try {
    const res = await client.query(query);
    const texts = res.rows.map((row) => row.embedding_text);
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
  if (!texts) return 0;

  const hf = new InferenceClient(process.env.HF_TOKEN);

  const embeddings = await Promise.all(
    texts.map((text) =>
      hf.featureExtraction({
        model: "pritamdeka/S-BioBERT-snli-scinli",
        inputs: text,
        provider: "hf-inference",
      }),
    ),
  );
}
