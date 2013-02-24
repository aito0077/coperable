package org.coperable.engine.search.es;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.node.Node;
import org.elasticsearch.search.SearchHit;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;
import static org.elasticsearch.index.query.QueryBuilders.termQuery;
import static org.elasticsearch.node.NodeBuilder.nodeBuilder;

public class ElasticSearchBean {
    public static final int DEFAULT_MAX_RESULTS = 50;

    public static final String INDEX_METHOD = "index";
    public static final String SEARCH_METHOD = "search";
    public static final String ID_HEADER = "ENTITY_ID";

    private final Client fClient;
    private final Node fNode;
    private final String fIndex;
    private final String fType;
    private final String fField;
    private int fMaxResults = DEFAULT_MAX_RESULTS;

    public ElasticSearchBean(String index, String type, String field) {
        fIndex = index;
        fType = type;
        fField = field;
        fNode = nodeBuilder().client(true).clusterName("elasticsearch").node();
        fClient = fNode.client();
    }

    public String getIndex() {
        return fIndex;
    }

    public String getType() {
        return fType;
    }

    public String getField() {
        return fField;
    }

    public int getMaxResults() {
        return fMaxResults;
    }

    public void setMaxResults(int maxResults) {
        fMaxResults = maxResults;
    }

    public List<String> search(Exchange exchange) {
        Message in = exchange.getIn();
        String query = in.getHeader("query", String.class);
        System.out.println("AITO: DEBUG: query: "+query);
        SearchResponse searchResponse = search (
            getField(), query,
            getMaxResults(), getIndex()
        );

        List<String> results = new ArrayList<String>();

        for (SearchHit hit : searchResponse.getHits()) {
            System.out.println("HIT: "+hit.getSource());
            results.add(hit.id());
        }

        return results;
    }
    
    public void index(Exchange exchange) {
        Message in = exchange.getIn();
        String id = in.getHeader(ID_HEADER, String.class);
        String content = in.getBody(String.class);
        try {
            System.out.println("AITO: DEBUG: ES: index: "+getIndex()+" - "+getType()+" - "+id+" - "+getField()+" - "+content);
            index(getIndex(), getType(), id, getField(), content);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void close() {
        fNode.close();
        fClient.close();
    }

    private IndexResponse index(String index, String type, String id, String fieldName, String fieldValue) throws IOException {
        XContentBuilder item = jsonBuilder()
        .startObject()
        .field(fieldName, fieldValue)
        .endObject();
        return fClient.prepareIndex(index, type, id)
        .setSource(item)
        .execute()
        .actionGet();
    }

    private SearchResponse search(String fieldName, String query, int maxResults, String indexes) {
        return fClient.prepareSearch(indexes)
        .setSearchType(SearchType.DEFAULT)
        .setQuery(termQuery(fieldName, query))
        .setFrom(0).setSize(maxResults).setExplain(true)
        .execute()
        .actionGet();
    }


}
